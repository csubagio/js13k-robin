


function forestBackground() {
  tiles = forestTilesAnim;

  let trees = makeIllustration(60, 80);
  rect(13, 23, 0, 14, 40);
  rect(0, 24, 0, 7, 40);

  for (let i = 0; i < 10; ++i) {
    let a = i * 1.173;
    let x = 30 + sin(a) * 17;
    let y = 45 + cos(a) * 14;
    circle(13, x, y, 16 - i);
    circle(0, x-pick([1,2]), y+2, 14 - i);
  }

  for (let i = 0; i < 10; ++i) {
    let x = floor( 30 * i + randomRange(-7, 8) );
    let y = floor( randomRange(2, 12) );
    tilePlanes.push({ illustration: trees, parallax: [0.4, 1], x, y});
  }

  let backMap = makeTilemap(50, 4);
  tileHLine(1, 0, 0, forestTilesTags.grass, CollisionType.None);

  tilePlanes.push({ tilemap: backMap, parallax: [0.5, 0.9], x:0, y:0 });
}

function placeGate(x: number, y: number) {
  tilePillar(x, y, 5, forestTilesTags.stone, forestTilesTags.stoneCap, CollisionType.None);
  tileHLine(y, x + 1, x + 4, forestTilesTags.stoneTrim, CollisionType.None);
  tilePillar(x+4, y, 5, forestTilesTags.stone, forestTilesTags.stoneCap, CollisionType.None);
  spawnGate((x+2) * 8 + 3, onGround);
}

const onGround = 8;

function makeLevel1() {
  forestBackground();

  let foreMap = makeTilemap(100, 20);
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  let x = 26;
  let y = 1;

  let cx = () => x * 8 + 4;
  let cy = () => y * 8;

  // floor parts
  tileHLine(0, 0, 24, forestTilesTags.ground, CollisionType.Floor);

  tilePillar(7, 1, 5, forestTilesTags.stump, forestTilesTags.stumpCap);

  x = 10;
  spawnGuy(cx(), 3 * 8);

  x += 6;
  spawnCoin(cx(), onGround);

  x += 6;

  repeat(4, (i) => {
    tileHLine(y, x, x + 3, forestTilesTags.ground, CollisionType.Floor);
    spawnCoin((x + 1) * 8 + 4, (y + 1) * 8, true, () => reportEvent(EventTypes.Jump));
    x += 5;
    y += 2;
  })

  y = 1;

  tileHLine(0, x, x + 24, forestTilesTags.ground, CollisionType.Floor);

  x += 12;

  placeGate(x, y);

  //spawnGuy(421, 3 * 8);
  spawnCoin(400, onGround);
}


function makeLevel2() {
  forestBackground();

  let foreMap = makeTilemap(100, 20);
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  let x = 26;
  let y = 1;

  let cx = () => x * 8 + 4;
  let cy = () => y * 8;

  tileHLine(0, 0, 48, forestTilesTags.ground, CollisionType.Floor);

  x = 3
  spawnGuy(cx(), 3 * 8);
  
  x += 6;
  placeGate(x, y);

  x += 12;
  spawnDummy(cx(), cy());

  x += 6;
  spawnDummy(cx(), cy());

  x += 6;
  spawnDummy(cx(), cy());
}


function makeLevel3() {
  forestBackground();

  let foreMap = makeTilemap(100, 20);
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  let x = 26;
  let y = 1;

  let cx = () => x * 8 + 4;
  let cy = () => y * 8;

  tileHLine(0, 0, 48, forestTilesTags.ground, CollisionType.Floor);

  x = 3
  spawnGuy(cx(), 3 * 8);
  
  x += 6;
  placeGate(x, y);

  x += 12;
  spawnMerry(cx(), cy());
}




function makeLevelXX() {
  tiles = forestTilesAnim;

  let backMap = makeTilemap(50, 4);
  tileHLine(1, 0, 0, forestTilesTags.grass, CollisionType.None);

  let foreMap = makeTilemap(50, 10);

  // floor
  tileHLine(0, 0, 0, forestTilesTags.ground, CollisionType.Floor);

  // coin pillar steps
  tilePut(5, 1, forestTilesTags.stumpCap, CollisionType.Floor);
  spawnCoin(5 * 8 + 4, 16);
  
  tilePillar(8, 1, 2, forestTilesTags.stump, forestTilesTags.stumpCap);
  spawnCoin(8 * 8 + 4, 24);

  tilePillar(12, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
  spawnCoin(12 * 8 + 4, 40);

  // high platform
  tileHLine(7, 15, 17, forestTilesTags.ground, CollisionType.Floor);
  spawnCoin(16*8 + 4, 8*8);
  
  tileHLine(8, 20, 22, forestTilesTags.ground, CollisionType.Floor);
  spawnCoin(21*8 + 4, 9*8);

  tileHLine(7, 23, 25, forestTilesTags.ground, CollisionType.Floor);
  spawnCoin(24*8 + 4, 8*8);

  tilePlanes.push({ tilemap: backMap, parallax: [0.5, 0.9], x:0, y:0 });
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  for (let i = 6; i <= 11; ++i) {
    effectTile(i, 1, forestTilesTags.fire);
  }

  spawnDummy(138, 8);
  spawnDummy(197, 8);
  spawnGuy(8, 24);
}

