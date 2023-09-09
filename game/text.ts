const font = makeAnim(fontData);

function printText(x: number, y: number, text: string, onlyMeasure: boolean = false) {
  let xx = x;
  for (let i = 0; i < text.length; ++i) {
    let c = byteAt(text, i);
    if (c === 32) {
      xx += 4; 
    } else if (c === 10) {
      xx = x; y += 8; 
    } else {
      let cel = font.cels[c-33];
      let cnvs = cel.planes[0].cnvs;
      if (!onlyMeasure) {
        ctx.drawImage( cnvs, xx, y + cel.y );
      }
      xx += cnvs.width + 1;
    }
  }
  return xx - x;
}

