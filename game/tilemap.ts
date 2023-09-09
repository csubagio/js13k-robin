const enum CollisionType {
  None,
  Floor,
  Solid,
}

interface Tile {
  index: number;
  collision: CollisionType;
}

interface EffectTile {
  range: [number, number];
  frame: number;
  time: number;
}

interface Tilemap {
  width: number;
  height: number;
  tiles: Tile[];
}

interface TilePlane {
  tilemap?: Tilemap;
  illustration?: Illustration;
  effectTile?: EffectTile;
  x: number, y: number;
  parallax: [number, number];
}

type TileCoordinates = [number, number];
type WorldCoordinates = [number, number];

let tilemap: Tilemap | undefined;
let tilePlanes: TilePlane[] = [];

const DeathFloor = -100;

function tilemapsClear() {
  tilemap = undefined;
  tilePlanes = [];
}

function makeTilemap(width: number, height: number): Tilemap {
  let t = { width, height, tiles: [] }
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      t.tiles[y * width + x] = { index: -1, collision: CollisionType.None }
    }
  }
  tilemap = t;
  return t;
}

function tilePut(x: number, y: number, indices: [number, number], collision: CollisionType) {
  let tile = tilemap.tiles[y * tilemap.width + x];
  tile.index = pickIntRange(indices);
  tile.collision = collision;
}

function tileHLine(height: number, start: number, end: number, indices: [number, number], collision: CollisionType) {
  let x = start;
  for (; x < end; ++x) {
    let tile = tilemap.tiles[height * tilemap.width + x];
    tile.index = pickIntRange(indices);
    tile.collision = collision;
  }
}

function tileVLine(x: number, start: number, height: number, indices: [number, number], collision: CollisionType) {
  let y = start;
  let end = start + ( height <= 0 ? tilemap.height-1 : height );
  for (; y <= end; ++y) {
    let tile = tilemap.tiles[y * tilemap.width + x];
    tile.index = pickIntRange(indices);
    tile.collision = collision;
  }
}

function tilePillar(x: number, y: number, h: number, lower: [number, number], upper: [number, number], collision: CollisionType = CollisionType.Solid) {
  tileVLine(x, y, h-1, lower, collision);
  tilePut(x, y+h-1, upper, collision);
}



function worldToTileCoords(pos: WorldCoordinates): TileCoordinates {
  return [floor(pos[0] / 8), floor(pos[1] / 8)];
}

function clampToTilemapBounds(pos: WorldCoordinates): WorldCoordinates {
  if (!tilemap) { return pos }
  return [clamp(0, tilemap.width * 8, pos[0]), clamp(0, tilemap.height * 8, pos[1])];
}

function getCollision(pos: WorldCoordinates): CollisionType {
  if (!tilemap) { return CollisionType.None }
  let tp = worldToTileCoords(pos);
  let tile = tilemap.tiles[tp[1] * tilemap.width + tp[0]];
  if (!tile) { return CollisionType.None }
  return tile.collision;
}

function findFloor(pos: WorldCoordinates): number {
  if (!tilemap) { return 0 }
  let x = floor(pos[0] / 8);
  if (x < 0 || x >= tilemap.width) {
    return DeathFloor;
  }
  let y = floor((pos[1]) / 8);
  for (; y >= 0; --y) {
    let tile = tilemap.tiles[y * tilemap.width + x];
    if (tile && [CollisionType.Floor, CollisionType.Solid].indexOf(tile.collision)>=0) {
      let fl = y * 8 + 8;
      if (fl < pos[1] + 0.05) {
        return fl;
      }
    }
  }
  return DeathFloor;
}

function effectTile(x: number, y: number, range: [number, number], parallax?: [number, number]) {
  tilePlanes.push({
    parallax: parallax || [1,1],
    x, y,
    effectTile: { range, frame: pickIntRange(range), time: 0 }
  })
}

function moveHorizontalAgainstTilemap(x: number, y: number, w: number, dx: number): number {
  if (!tilemap) { return x }
  let cox = x + dx;
  let ox = x + dx + ( dx < 0 ? -w : w );
  x -= dx * 0.001;
  let tx = floor(x / 8);
  let otx = floor(ox / 8);
  if (tx === otx) { return cox }
  let ty = floor(y / 8);
  if (ty < 0) { return cox }
  if (tx > otx) {
    while (tx !== otx) {
      tx--;
      if ( tx < 0 ) return w
      let tile = tilemap.tiles[ty * tilemap.width + tx];
      if (tile.collision === CollisionType.Solid) {
        return tx * 8 + 8 + w;
      }
    }
  } else {
    while (tx !== otx) {
      tx++;
      if (tx >= tilemap.width) return tilemap.width * 8 - w;
      let tile = tilemap.tiles[ty * tilemap.width + tx];
      if (tile.collision === CollisionType.Solid) {
        return tx * 8 - w;
      }
    }
  }
  return cox;
}


let tiles: Anim;
let parallax = [1,1];
function drawTile(cid: number, x: number, y: number) {
  applyCameraParallax(parallax[0], parallax[1]);
  let cel = tiles.cels[cid];
  ctx.drawImage(
    cel.planes[0].canvas,
    x * 8 + cel.x,
    y * -8 + cel.y - 8
  );
}

function tilemapDraw() {
  tilePlanes.forEach(p => {
    parallax = p.parallax;
    let tm = p.tilemap;
    if (tm) {
      for (let y = 0; y < tm.height; ++y) {
        for (let x = 0; x < tm.width; ++x) {
          let tile = tm.tiles[y * tm.width + x];
          if (!tile || tile.index < 0) continue;
          drawTile(tile.index, x, y);
        }
      }
    }

    let ill = p.illustration;
    if (ill) {
      applyCameraParallax(parallax[0], parallax[1]);
      ctx.scale(1, -1);
      ctx.drawImage(ill.canvas, p.x, p.y);
    }

    let eff = p.effectTile;
    if (eff) {
      eff.time += ds * 100;
      let dur = tiles.cels[eff.frame].duration;
      if (eff.time > dur) {
        eff.time -= dur;
        eff.frame++;
        if (eff.frame > eff.range[1]) {
          eff.frame = eff.range[0];
        }
      }
      drawTile(eff.frame, p.x, p.y);
    }
  })
}



function composeTiles( tiles: Anim, ox: number, oy: number, w: number, h: number, indices: number[] ): Cel {
  let canvas = new OffscreenCanvas(w * 8, h * 8);
  let ctx = canvas.getContext('2d');
  //ctx.strokeStyle = '#f00';
  //ctx.strokeRect(0, 0, w * 8, h * 8);
  let i = 0;
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      let tile = tiles.cels[indices[i++]];
      ctx.drawImage(tile.planes[0].canvas, x * 8 + tile.x, y * 8 + tile.y);
    }
  }
  return {
    x: ox, y: oy, duration: 100, planes: [{canvas}]
  }
}
