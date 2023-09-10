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

let fixedRandomData: number[] = [];
for ( let i=0; i<32; ++i ) {
  fixedRandomData[i] = pick([0,1,2,3,4]);
}

function fixedRandom(v: number) {
  return fixedRandomData[v%fixedRandomData.length];
}

function randomRange(v0: number, v1: number) {
  return v0 + (v1 - v0) * random();
}

function repeat(count: number, fn: (n:number) => void) { for (let i = 0; i < count; ++i) fn(i) }

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
