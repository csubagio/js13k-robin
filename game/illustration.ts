interface Illustration {
  cnvs: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
}

let illctx: OffscreenCanvasRenderingContext2D;

function makeIllustration(w: number, h: number): Illustration {
  let cnvs = new OffscreenCanvas(w, h);
  let ctx = cnvs.getContext("2d") as OffscreenCanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  illctx = ctx;
  //illctx.filter = 'blur(1px)'
  return { cnvs, ctx };
}

function circle(color: number, x: number, y: number, r: number) {
  illctx.beginPath();
  illctx.fillStyle = cssPalette[color];
  illctx.arc(x, y, r, 0, 6.3);
  illctx.fill();
}

function rect(color: number, x: number, y: number, w: number, h: number) {
  illctx.fillStyle = cssPalette[color];
  illctx.fillRect(x, y, w, h);
}

