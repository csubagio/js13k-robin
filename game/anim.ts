
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
  NoLoopReverse,
}

interface Plane {
  cnvs: OffscreenCanvas;
}

interface Cel {
  x: number, y: number; dur: number;
  planes: Plane[];
}

interface AnimInstance {
  frm: number;
  tme: number;
  rnge: AnimRange;
  styl: AnimStyle;
  onLoop?: () => void;
}

interface Anim {
  cels: Cel[];
}

function unpackBytes(data: string): number[] {
  const binstring = atob(data);
  const bin: number[] = binstring.split('').map(c => byteAt(c, 0));
  return bin;
}

function makeAnim(data: string): Anim {
  const bin = unpackBytes(data);
  const cels: Cel[] = [];

  let i = 0;
  while (i < bin.length) {
    let x = 0, y = 0, w = 0, h = 0, dur = 0;
    x = bin[i++];
    y = bin[i++];
    w = bin[i++];
    h = bin[i++];
    dur = bin[i++];

    const cel: Cel = { x, y, dur, planes: [] };
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

    const { cnvs, ctx } = makeIllustration(w, h);

    const plane: Plane = { cnvs }
    cel.planes.push(plane);

    const byteCount = ceil(w * h / 8 * bitDepth);
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    let di = 0;

    repeat(byteCount, (imgbi) => {
      let byte = bin[i++];
      repeat(8/bitDepth, (biti) => {
        let set = (byte >> (biti*bitDepth)) & bitMask;
        let cc = colors[set];
        data[di] = cc[0];
        data[di + 1] = cc[1];
        data[di + 2] = cc[2];
        data[di + 3] = set ? 255 : 0;
        di += 4;
      })
    })
    ctx.putImageData(img, 0, 0);
  }

  return { cels }
}


function recolorCel(cel: Cel, colorIndex: number) {
  cel.planes.map(p => {
    let cnvs = p.cnvs;
    let ctx = get2DContext(cnvs);
    let [w, h] = [cnvs.width, cnvs.height];
    let img = ctx.getImageData(0, 0, w, h);
    let data = img.data;
    let color = palette[colorIndex];
    repeatXY(w, h, (x, y) => {
      let i = 4 * (y * w + x);
      if (data[i + 3]) {
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    })
    ctx.putImageData(img, 0, 0);
  })
}

function recolorCels(anim: Anim, colorIndex: number) {
  anim.cels.map(c => recolorCel(c, colorIndex));
}

function fillCel(cel: Cel, colorIndex: number) {
  cel.planes.map(p => {
    let cnvs = p.cnvs;
    let ctx = get2DContext(cnvs);
    let [w, h] = [cnvs.width, cnvs.height];
    let img = ctx.getImageData(0, 0, w, h);
    let data = img.data;
    let color = palette[colorIndex];
    let base = (x: number, y: number) => 4 * (y * w + x);
    repeatXY(w, h, (x, y) => {
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
    });
    ctx.putImageData(img, 0, 0);
  })
}

function fillCels(anim: Anim, colorIndex: number) {
  anim.cels.map(c => fillCel(c, colorIndex));
}

function makeAnimInstance(rnge: AnimRange, styl: AnimStyle): AnimInstance {
  let frm = pickIntRange(rnge);
  let tme = random() * 100;
  return {
    rnge, styl, frm, tme
  }
}


function animInstanceTick(anim: Anim, inst: AnimInstance) {
  let dur = anim.cels[inst.frm]?.dur;
  inst.tme += ds * 100;
  if (inst.tme >= dur) {
    inst.tme -= dur;
    if (contains([AnimStyle.PingPongReverse, AnimStyle.LoopReverse, AnimStyle.NoLoopReverse], inst.styl)) {
      inst.frm--;
    } else {
      inst.frm++;
    }
    if (inst.frm > inst.rnge[1]) {
      inst.onLoop?.();
      [
        // NoLoop
        () => {
          inst.frm = inst.rnge[1];
          inst.tme = dur;
        },
        // Loop
        () => {
          inst.frm = inst.rnge[0];
        },
        // LoopReverse
        noop,
        // PingPong
        () => {
          inst.frm = inst.rnge[1] - 1;
          inst.styl = AnimStyle.PingPongReverse;
        },
        // PingPongReverse
        noop,
        // NoLoopReverse
        noop
      ][inst.styl]();
    }
    if (inst.frm < inst.rnge[0]) {
      [
        // NoLoop
        noop,
        // Loop
        noop,
        // LoopReverse
        () => inst.frm = inst.rnge[1],
        // PingPong
        noop,
        // PingPongReverse
        () => {
          inst.frm = inst.rnge[0] + 1;
          inst.styl = AnimStyle.PingPong;
        },
        // NoLoopReverse
        () => {
          inst.frm = inst.rnge[0];
        }
      ][inst.styl]();
    }
  }
}

function drawAnim(anim: Anim, frm: number, x: number, y: number) {
  let cel = anim.cels[frm];
  cel.planes.map(p => {
    drawImage(p.cnvs, round(cel.x + x), round(cel.y + y));
  })
}

function animInstanceSetRange(inst: AnimInstance, rnge: AnimRange, styl: AnimStyle) {
  inst.rnge = rnge;
  if (inst.frm < inst.rnge[0] || inst.frm > inst.rnge[1]) {
    inst.frm = rnge[0];
  }
  inst.styl = styl;
}

function animInstanceResetRange(inst: AnimInstance, rnge: AnimRange, styl: AnimStyle) {
  inst.rnge = rnge;
  inst.frm = rnge[0];
  inst.styl = styl;
  inst.tme = 0;
}

function animIsFinished(e: { anim: Anim, inst: AnimInstance }) {
  let dur = e.anim.cels[e.inst.frm].dur;
  return e.inst.frm >= e.inst.rnge[1] && e.inst.tme >= dur;
}

function animIsRelativeFrame(inst: AnimInstance, frm: number) {
  return (inst.frm - inst.rnge[0]) === frm;
}


