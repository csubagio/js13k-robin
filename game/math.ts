const round = Math.round;
const floor = Math.floor;
const ceil = Math.ceil;
const pow = Math.pow;
const abs = Math.abs;
const min = Math.min;
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const random = Math.random;
const clamp = (minx, maxx, x) => min(minx, max(maxx, x));
const PI = Math.PI;
const byteAt = (s: string, i: number) => s.charCodeAt(i);


let ds = 0;
let clck = 0;

function pick(arr:any[]) {
  return arr[floor(random()*arr.length)];
}

function pickIntRange(arr:[number, number]) {
  return round( arr[0] + (arr[1] - arr[0]) * random() );
}

function randomRange(v0: number, v1: number) {
  return v0 + (v1 - v0) * random();
}

function repeat(count: number, fn: (n: number) => void) {
  for (let i = 0; i < count; ++i)
    fn(i)
}

function repeatXY(xc: number, yc: number, fn: (x: number, y: number) => void) {
  for (let y = 0; y < yc; ++y)
    for (let x = 0; x < xc; ++x)
      fn(x, y);
}

interface Capsule {
  x: number, y: number,
  w: number, h: number
};

function intersectCapsules(a: Capsule | 0, b: Capsule | 0) {
  if (!(a && b)) { return false }
  if (abs(b.x - a.x) > (a.w + b.w)) { return false; }
  if (b.y - a.y > a.h) { return false; }
  if (a.y - b.y > b.h) { return false; }
  return true
}

interface RelativeCapsuleThing {
  x: number;
  y: number;
  h: number;
  facing: number;
}

function capsuleAhead(e: RelativeCapsuleThing, ox1: number, ox2: number): Capsule {
  let w = (ox2 - ox1) / 2;
  return { x: e.x + e.facing * (ox1 + w), y: e.y, w: abs(w), h: e.h }
}



function lerpInRange(from: number, to: number, v: number): number {
  let t = (v - from) / (to - from);
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return t * t * (3 - 2 * t);
}

function contains(arr: any[], x: any) {
  return arr.indexOf(x) >= 0;
}

function globalAlph(alpha: number) {
  ctx.globalAlpha = alpha;
}

function fillStyl(styl: string, c?: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D) {
  (c||ctx).fillStyle = styl;
}

function drawImage(img: CanvasImageSource, x: number, y: number) {
  ctx.drawImage(img, x, y);
}

const get2DContext = (ctx: HTMLCanvasElement | OffscreenCanvas) : OffscreenCanvasRenderingContext2D => ctx.getContext('2d') as OffscreenCanvasRenderingContext2D;

const noop = () => {}
