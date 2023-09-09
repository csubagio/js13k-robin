const font = makeAnim(fontData);

function printText(x: number, y: number, text: string) {
  let xx = x;
  for (let i = 0; i < text.length; ++i) {
    let c = text.charCodeAt(i);
    if (c === 32) { xx += 4; continue; }
    if (c === 10) { xx = x; y += 8; continue; }
    let cel = font.cels[c-33];
    let canvas = cel.planes[0].canvas;
    ctx.drawImage( canvas, xx, y + cel.y );
    xx += canvas.width + 1;
  }
  return xx - x;
}

