type Color = [number, number, number];

const palette: Color[] = [];
const cssPalette: string[] = [];
function loadPalette() {
  let bin = unpackBytes(paletteData);
  repeat(bin.length / 3, (i) => {
    let c = bin.slice(i * 3, i * 3 + 3) as Color;
    palette.push(c);
    cssPalette.push(`rgb(${c.join(',')})`);
  })
}
