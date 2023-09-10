const Aseprite = require('aseprite');
import fs, { watch } from 'fs';
import path from 'path';
import util from 'util';
import { WatchOnce, TimeStamper } from './watch-once';

enum ChunkType {
  LAYER = 8196,
  CEL = 8197,
  CEL_EXTRA = 8198,
  COLOR_PROFILE = 8199,
  TAGS = 8216,
  PALETTE = 8217,
  USERDATA = 8224,
  SLICE = 8226,
}

enum PixelFormat {
  INDEXED = 8,
  GRAYSCALE = 16,
  RGBA = 32,
}

interface ColorProfileChunk {
  type: ChunkType.COLOR_PROFILE;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface PaletteChunk {
  type: ChunkType.PALETTE;
  data: {
    numEntries: number;
    firstIndex: number;
    lastIndex: number;
    entries: Color[];
  }
}

interface LayerChunk {
  type: ChunkType.LAYER;
  data: {
    childLevel: number;
    blendMode: number;
    opacity: number;
    name: string;
  }
}

interface CellChunk {
  type: ChunkType.CEL;
  data: {
    layerIndex: number;
    x: number;
    y: number;
    opacity: number;
    type: number;
    width: number;
    height: number;
    pixels: Uint8Array;
  }
}

interface Tag {
  from: number;
  to: number;
  direction: number;
  name: string;
}

interface TagsChunk {
  type: ChunkType.TAGS;
  data: {
    tags: Tag[];
  }
}

type AseChunk = ColorProfileChunk | PaletteChunk | LayerChunk | CellChunk | TagsChunk;

interface AseFrame {
  header: {
    duration: number
  },
  chunks: AseChunk[];
}

interface AseFile {
  numFrames: number;
  width: number;
  height: number;
  pixelFormat: PixelFormat;
  numColors: number;
  frames: AseFrame[];
}

function filename(...rest: string[]) {
  let parts = [__dirname, '..', 'art'].concat(rest);
  return path.join.apply(path, parts);
}

function padHex(n: number) {
  let s = n.toString(16);
  if (s.length === 1) { return '0' + s }
  return s;
}

class CelImage {
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;
  pixels: Uint8Array = new Uint8Array;

  scanHLineForEmpty(y: number) {
    for (let x = 0; x < this.w; ++x) {
      if (this.pixels[y*8+x] !== 0) {
        return false;
      }
    }
    console.log(`found empty, y === ${y}`);
    return true;
  }

  scanVLineForEmpty(x: number) {
    for (let y = 0; y < this.h; ++y) {
      if (this.pixels[y*8+x] !== 0) {
        return false;
      }
    }
    return true;
  }

  trimEmpty(): boolean {
    let trimmed = false;
    while (true) {
      if (!this.scanHLineForEmpty(0)) break;
      trimmed = true;
      this.y += 1; this.h -= 1;
      this.pixels = this.pixels.slice(this.w);
    }

    while (true) {
      if (!this.scanHLineForEmpty(this.h-1)) break;
      trimmed = true;
      this.h -= 1;
      this.pixels = this.pixels.slice((this.h-2)*this.w);
    }

    const removeCol = (skip: number): Uint8Array => {
      let old = this.pixels;
      let news = new Uint8Array(this.h * (this.w - 1));
      for (let y = 0; y < this.h; ++y) {
        let tx = 0;
        for (let x = 0; x < this.w; ++x) {
          if (x !== skip) {
            news[y * (this.w - 1) + tx++] = old[y * this.w + x];
          }
        }
      }
      return news;
    }

    while (true) {
      if (!this.scanVLineForEmpty(0)) break;
      trimmed = true;
      this.pixels = removeCol(0);
      this.x += 1; this.w -= 1;
    }

    while (true) {
      if (!this.scanVLineForEmpty(this.w - 1)) break;
      trimmed = true;
      this.pixels = removeCol(this.w-1);
      this.w -= 1;
    }

    return trimmed;
  }

  getPalette(): number[] {
    let set: Record<number, true> = {};
    this.pixels.forEach(i => set[i] = true);
    return Object.keys(set).map(s => parseInt(s));
  }

  getBitPlane(color?: number): Uint8Array {
    if (color === undefined) {
      color = this.getPalette()[1];
    }
    let byteLength = Math.ceil(this.pixels.length / 8);
    let bytes = new Uint8Array(byteLength);
    bytes.fill(0);
    let byteIndex = 0;
    let bitIndex = 0;
    for (let i = 0; i < this.pixels.length; ++i) {
      let pcol = this.pixels[i];
      let set = pcol === color || (color === -1 && pcol != 0);
      if (set) {
        bytes[byteIndex] = bytes[byteIndex] | (1 << bitIndex);
      }
      bitIndex++;
      if (bitIndex > 7) {
        byteIndex++;
        bitIndex = 0;
      }
    }
    return bytes;
  }

  get2BitPlane(palette: number[]): Uint8Array {
    let byteLength = Math.ceil(this.pixels.length / 4);
    let bytes = new Uint8Array(byteLength);
    bytes.fill(0);
    let byteIndex = 0;
    let bitIndex = 0;
    for (let i = 0; i < this.pixels.length; ++i) {
      let pcol = this.pixels[i];
      let col = palette.indexOf(pcol);
      bytes[byteIndex] |= col << bitIndex;
      bitIndex += 2;
      if (bitIndex > 7) {
        byteIndex++;
        bitIndex = 0;
      }
    }
    return bytes;
  }

  getBitPlaneAsBase64(color?: number): string {
    return Buffer.from(this.getBitPlane(color)).toString('base64');
  }
}

let watcher = new WatchOnce(() => exportSprites());

class Ase {
  file: AseFile
  layerNames: string[] = [];
  frameDurations: number[] = [];

  constructor(public filename: string) {
    watcher.watch(filename);

    const contents = fs.readFileSync(filename);
    const ase = Aseprite.parse(contents, {
      clean: true,
      inflate: true
    });

    this.file = ase as AseFile;

    this.file.frames[0].chunks.forEach(c => {
      if (c.type === ChunkType.LAYER) {
        this.layerNames.push(c.data.name);
      }
    })
  }

  getImage(frameIndex: number, layerName: string) {
    let frame = this.file.frames[frameIndex];
    let layerIndex = this.layerNames.indexOf(layerName);
    let celChunk = frame.chunks.find(c => c.type === ChunkType.CEL && c.data.layerIndex === layerIndex) as CellChunk;
    if (!celChunk) {
      return undefined;
    }
    let cel = celChunk.data;
    let img = new CelImage;
    img.x = cel.x;
    img.y = cel.y;
    img.w = cel.width;
    img.h = cel.height;
    img.pixels = cel.pixels.map(i => i);
    if (img.trimEmpty()) {
      console.log(`trimmed ${this.filename}`);
    }
    return img;
  }

  packAnim(layerName: string) {
    let result: number[] = [];

    this.file.frames.forEach((f, i) => {
      let cel = this.getImage(i, layerName);
      if (!cel) return;

      result.push(cel.x);
      result.push(cel.y);
      result.push(cel.w);
      result.push(cel.h);
      result.push(Math.floor(f.header.duration / 10));

      let palette = cel.getPalette();

      if (palette.length == 1 || (palette.length === 2 && palette[0] == 0)) {
        result.push(1);
        let color = palette[1] || palette[0];
        result.push(color);
        let bits = cel.getBitPlane(color);
        bits.forEach(b => result.push(b));
      } else if (palette.length <= 4) {
        result.push(2);
        for (let pi = 0; pi < 4; ++pi) {
          result.push(palette[pi] || 0);
        }
        let bits = cel.get2BitPlane(palette);
        bits.forEach(b => result.push(b));
        /*
        for (let pi = 0; pi < palette.length; ++pi) {
          if (palette[pi]) {
            result.push(1);
            let color = palette[pi];
            result.push(color);
            let bits = cel.getBitPlane(color);
            bits.forEach(b => result.push(b));
          }
        }
        */
      } else {
        throw (`too many colors: ${this.filename}, ${layerName}, ${palette.join(',')}`);
      }
    })

    let asBytes = new Uint8Array(result);
    return Buffer.from(asBytes).toString("base64");
  }

  getTags(): Tag[] {
    let res: TagsChunk[] = [];
    let chunk = this.file.frames[0].chunks.find(c => c.type === ChunkType.TAGS) as TagsChunk;
    if (chunk) {
      return chunk.data.tags;
    }
    return [];
  }

  getPalettePacked(): string {
    let chunk = this.file.frames[0].chunks.find(c => c.type === ChunkType.PALETTE) as PaletteChunk;
    let bytes = new Uint8Array(chunk.data.entries.length * 3);
    chunk.data.entries.forEach((c, i) => {
      bytes[i * 3] = c.r;
      bytes[i * 3 + 1] = c.g;
      bytes[i * 3 + 2] = c.b;
    })
    return Buffer.from(bytes).toString('base64');
  }

  inspectChunks(type: ChunkType) {
    this.file.frames[0].chunks.forEach(c => {
      if (c.type !== type) return;
      switch (c.type) {
        case ChunkType.PALETTE: {
          console.log('palette: ');
          c.data.entries.forEach(e => {
            console.log(`  #${padHex(e.r)}${padHex(e.g)}${padHex(e.b)}`);
          })
          break;
        }
        case ChunkType.CEL: {
          let d = c.data;
          console.log(util.inspect(d, { depth: null, colors: true }));
          console.log(d.width * d.height, d.pixels.length);
          break;
        }
        default: {
          console.log(util.inspect(c, { depth: null, colors: true }));
          break;
        }
      }
    })
  }
}





export function exportSprites() {
  const stamp = new TimeStamper(`spriter`);

  let output: string[] = [];
  function writeTags(name: string) {
    let tagsout: string[] = [];
    tagsout.push(`const ${name}Tags = {`);
    s.getTags().forEach(t => {
      tagsout.push(`  ${t.name}: [${t.from}, ${t.to}] as AnimRange,`);
    })
    tagsout.push('}')
    output.push(tagsout.join('\n'));
  }

  let s = new Ase(filename('guy.aseprite'));
  output.push(`const paletteData = "${s.getPalettePacked()}";`);
  output.push(`loadPalette();`);
  //s.inspectChunks(ChunkType.TAGS);

  function exportLayerAnim(name: string, layerName: string, includeTags: boolean) {
    s = new Ase(filename(`${name}.aseprite`));
    output.push(`const ${name}Data = "${s.packAnim(layerName)}";`);
    if (includeTags) {
      writeTags(name);
    }
    output.push(`const ${name}Anim = makeAnim(${name}Data);`);
  }

  exportLayerAnim('guy', 'guy', true);
  exportLayerAnim('font', 'glyphs', false);
  exportLayerAnim('forestTiles', 'tiles', true);
  exportLayerAnim('dummy', 'dummy', true);
  exportLayerAnim('target', 'target', true);
  exportLayerAnim('coin', 'coin', true);
  exportLayerAnim('portrait', 'face', true);
  exportLayerAnim('merry', 'merry', true);
  //exportLayerAnim('font3x3', 'glyphs', false);

  fs.writeFileSync('../game/data.ts', output.join('\n\n'));

  stamp.end();
}

exportSprites();

