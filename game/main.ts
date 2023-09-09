

let mainCanvas = document.getElementById('c') as HTMLCanvasElement;
let screenWidth = 128;
let screenHeight = 80;
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
let ctx = mainCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

mainCanvas.style.maxWidth = `${screenWidth*4}px`;

fillCels(targetAnim, 4);
//makeEnemy(targetAnim, 155, 8, targetTags.idle);

let last = 0;
let ds = 0.001;
//playGuitarSong();

let titleWidth = [0,0,0,0,0];

function tick(clock: number) {
  resetTransform();
  ctx.fillStyle = '#21181b';
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  let dt = min( 100, clock - last );
  if ( last === 0 ) { dt = 0 }
  last = clock;
  ds = dt / 1000.0;

  tickGuy(guy);
  enemiesTick();

  cameraUpdate();

  tilemapDraw();
  enemiesDraw();
  guyDraw(guy);

  ctx.resetTransform();

  if (dialogTick()) {

  } else {
    if (coinsTotal) {
      drawAnim(coinAnim, 0, 107 - 21, 73 - 18);
      printText( 107, 72, `${coinCounter}/${coinsTotal}`);
    }
  }

  sceneTick();

  //guitarSongTick(guitarSong1, ds);
  //guitarSongTick(guitarSong2, ds);

  justPressed = [];

  requestAnimationFrame(tick);
}

tick(0);

