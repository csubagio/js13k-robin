
type AnimRange = [number, number];
type AnimData = [number, number, number, number, string];

const enum AnimLoadMode {
  CelCount,
  CelHeader,
  CelData,
}

const enum AnimStyle {
  NoLoop,
  Loop,
  LoopReverse,
  PingPong,
  PingPongReverse,
}

interface Plane {
  canvas: OffscreenCanvas;
}

interface Cel {
  x: number, y: number; duration: number;
  planes: Plane[];
}

interface AnimInstance {
  frame: number;
  time: number;
  range: AnimRange;
  loop: AnimStyle;
}

interface Anim {
  cels: Cel[];
}

function unpackBytes(data: string): number[] {
  const binstring = atob(data);
  const bin: number[] = [];
  for (let i = 0; i < binstring.length; ++i) {
    bin.push(binstring.charCodeAt(i));
  }
  return bin;
}

function makeAnim(data: string): Anim {
  const bin = unpackBytes(data);
  const cels: Cel[] = [];

  let i = 0;
  while (i < bin.length) {
    let x = 0, y = 0, w = 0, h = 0, duration = 0;
    x = bin[i++];
    y = bin[i++];
    w = bin[i++];
    h = bin[i++];
    duration = bin[i++];

    const cel: Cel = { x, y, duration, planes: [] };
    cels.push(cel);

    const bitDepth = bin[i++];
    const colorCount = pow(2, bitDepth);
    let colors: Color[] = [];
    if (bitDepth === 1) {
      colors = [palette[bin[0]], palette[bin[i++]]];
    } else {
      repeat(colorCount, (ii) => colors[ii] = palette[bin[i++]]);
    }
    const bitMask = (1 << bitDepth) - 1;

    const { canvas, ctx } = makeIllustration(w, h);

    const plane: Plane = { canvas }
    cel.planes.push(plane);

    const byteCount = ceil(w * h / 8 * bitDepth);
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    let di = 0;

    for (let imgbi = 0; imgbi < byteCount; ++imgbi) {
      let byte = bin[i++];
      for (let biti = 0; biti < 8; biti += bitDepth) {
        let set = (byte >> biti) & bitMask;
        let cc = colors[set];
        data[di] = cc[0];
        data[di + 1] = cc[1];
        data[di + 2] = cc[2];
        data[di + 3] = 255;
        di += 4;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  return { cels }
}


function recolorCel(cel: Cel, colorIndex: number) {
  cel.planes.map(p => {
    let canvas = p.canvas;
    let ctx = canvas.getContext("2d");
    let [w, h] = [canvas.width, canvas.height];
    let img = ctx.getImageData(0, 0, w, h);
    let data = img.data;
    let color = palette[colorIndex];
    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        let i = 4 * (y * w + x);
        if (data[i + 3]) {
          data[i] = color[0];
          data[i + 1] = color[1];
          data[i + 2] = color[2];
          data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  })
}

function recolorCels(anim: Anim, colorIndex: number) {
  anim.cels.map(c => recolorCel(c, colorIndex));
}

function fillCel(cel: Cel, colorIndex: number) {
  cel.planes.map(p => {
    let canvas = p.canvas;
    let ctx = canvas.getContext("2d");
    let [w, h] = [canvas.width, canvas.height];
    let img = ctx.getImageData(0, 0, w, h);
    let data = img.data;
    let color = palette[colorIndex];
    let base = (x: number, y: number) => 4 * (y * w + x);
    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        let inside = 0;
        for (let xx = x - 1; xx >= 0; --xx) {
          if (data[base(xx, y) + 3]) {
            inside += 1; break;
          }
        }
        for (let xx = x + 1; xx < w; ++xx) {
          if (data[base(xx, y) + 3]) {
            inside += 1; break;
          }
        }
        for (let yy = y - 1; yy >= 0; --yy) {
          if (data[base(x, yy) + 3]) {
            inside += 1; break;
          }
        }
        for (let yy = y + 1; yy < h; ++yy) {
          if (data[base(x, yy) + 3]) {
            inside += 1; break;
          }
        }

        let i = base(x, y);
        if (inside == 4 && !data[i + 3]) {
          data[i] = color[0];
          data[i + 1] = color[1];
          data[i + 2] = color[2];
          data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  })
}

function fillCels(anim: Anim, colorIndex: number) {
  anim.cels.map(c => fillCel(c, colorIndex));
}

function makeAnimInstance(range: AnimRange, loop: AnimStyle): AnimInstance {
  let frame = pickIntRange(range);
  let time = random() * 100;
  return {
    range, loop, frame, time
  }
}


function animInstanceTick(anim: Anim, inst: AnimInstance) {
  let dur = anim.cels[inst.frame]?.duration;
  inst.time += ds * 100;
  if (inst.time >= dur) {
    inst.time -= dur;
    if (inst.loop === AnimStyle.PingPongReverse || inst.loop === AnimStyle.LoopReverse) {
      inst.frame--;
    } else {
      inst.frame++;
    }
    if (inst.frame > inst.range[1]) {
      switch (inst.loop) {
        case AnimStyle.NoLoop:
          inst.frame = inst.range[1];
          inst.time = dur;
          break;
        case AnimStyle.PingPong:
          inst.frame = inst.range[1] - 1;
          inst.loop = AnimStyle.PingPongReverse;
          break;
        case AnimStyle.Loop:
        default:
          inst.frame = inst.range[0];
          break;
      }
    }
    if (inst.frame < inst.range[0]) {
      switch (inst.loop) {
        case AnimStyle.PingPongReverse:
          inst.frame = inst.range[0] + 1;
          inst.loop = AnimStyle.PingPong;
          break;
        case AnimStyle.LoopReverse:
          inst.frame = inst.range[1];
          break;
        default:
          inst.frame = inst.range[0];
          break;
      }
    }
  }
}

function drawAnim(anim: Anim, frame: number, x: number, y: number) {
  let cel = anim.cels[frame];
  cel.planes.map(p => {
    ctx.drawImage(p.canvas, round(cel.x + x), round(cel.y + y));
  })
}

function animInstanceSetRange(inst: AnimInstance, range: AnimRange, loop: AnimStyle) {
  inst.range = range;
  if (inst.frame < inst.range[0] || inst.frame > inst.range[1]) {
    inst.frame = range[0];
  }
  inst.loop = loop;
}

function animInstanceResetRange(inst: AnimInstance, range: AnimRange, loop: AnimStyle) {
  inst.range = range;
  inst.frame = range[0];
  inst.loop = loop;
  inst.time = 0;
}

function animIsFinished(e: { anim: Anim, inst: AnimInstance }) {
  let dur = e.anim.cels[e.inst.frame].duration;
  return e.inst.frame >= e.inst.range[1] && e.inst.time >= dur;
}

function animIsRelativeFrame(inst: AnimInstance, frame: number) {
  return (inst.frame - inst.range[0]) === frame;
}


