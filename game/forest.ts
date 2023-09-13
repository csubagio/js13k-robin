


function forestBackground() {
  tiles = forestTilesAnim;

  let trees = makeIllustration(60, 80);
  rect(13, 23, 0, 14, 40);
  rect(0, 24, 0, 7, 40);

  repeat( 10, (i) => {
    let a = i * 1.173;
    let x = 30 + sin(a) * 17;
    let y = 45 + cos(a) * 14;
    circle(13, x, y, 16 - i);
    circle(0, x-pick([1,2]), y+2, 14 - i);
  })

  repeat( 20, (i) => {
    let x = floor( 30 * i + randomRange(-7, 8) );
    let y = floor( randomRange(2, 12) );
    tilePlanes.push({ illustration: trees, parallax: [0.4, 1], x, y});
  })

  let backMap = makeTilemap(80, 4);
  tileHLine(0, 0, 80, forestTilesTags.solidGrass, CollisionType.None);
  tileHLine(1, 0, 80, forestTilesTags.solidGrass, CollisionType.None);
  tileHLine(2, 0, 80, forestTilesTags.solidGrass, CollisionType.None);
  tileHLine(3, 0, 80, forestTilesTags.grass, CollisionType.None);

  tilePlanes.push({ tilemap: backMap, parallax: [0.5, 0.9], x:0, y:-2 });
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

  let x = 3;
  let y = 1;
  
  let cx = () => x * 8 + 4;
  let cy = () => y * 8;

  tileHLine(0, x, 48, forestTilesTags.ground, CollisionType.Floor); 

  x += 3
  spawnGuy(cx(), 3 * 8);
  
  x += 6;
  placeGate(x, y);

  x += 12;
  spawnMerry(cx(), cy());
}



function makeLevel4() {
  forestBackground();

  let foreMap = makeTilemap(128, 30);
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  let x = 3;
  let y = 1;
  
  let cx = () => x * 8 + 4;
  let cy = () => y * 8;


  let fl = x;
  
  x += 3
  spawnGuy(cx(), 3 * 8);

 
  x += 6

  /*
  repeat(7, () => {
    effectTile(x++, 1, forestTilesTags.fire);
  })
  x -= 8
  */
  

  // 3 pillar steps
  tilePut(x, 1, forestTilesTags.stumpCap, CollisionType.Floor);
  spawnCoin(cx(), cy() + 8);
  
  x += 4
  tilePillar(x, 1, 2, forestTilesTags.stump, forestTilesTags.stumpCap);
  spawnCoin(cx(), cy() + 16);

  x += 4
  tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
  spawnCoin(cx(), cy() + 32);


  // 3 platforms to dead end 
  x += 4
  y = 6;
  tileHLine(y, x, x+4, forestTilesTags.ground, CollisionType.Floor); 

  x += 4 + 6
  tileHLine(y, x, x+4, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);
 

  tileHLine(0, fl, x-2, forestTilesTags.ground, CollisionType.Floor); 
  fl = x + 6;

  x += 2 + 6
  tileHLine(6, x, x+5, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);

  x += 2 + 6
  tileHLine(6, x, x+5, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);

  x += 2
  tilePillar(x, y+1, y + 10, forestTilesTags.stump, forestTilesTags.stumpCap);

  x -= 13
  y = 1
  spawnPiggy(cx(), cy(), 1);

  x += 12
  spawnPiggy(cx(), cy(), -1);

  x += 10
  tileHLine(0, fl, x, forestTilesTags.ground, CollisionType.Floor); 

  x += 4
  fl = x;

  x += 5
  spawnSpikes(cx() + 5, cy(), 0);


  x += 5
  repeat(7, (i) => {
    spawnSpikes(cx() + 5, cy(), 2.9 - i * 0.15);
    x+=2;
  })

  x += 4
  tilePillar(x, y, y + 8, forestTilesTags.stump, forestTilesTags.stumpCap);

  x -= 8
  tileHLine(5, x, x+4, forestTilesTags.ground, CollisionType.Floor); 

  x -= 8
  tileHLine(6, x, x+4, forestTilesTags.ground, CollisionType.Floor); 

  x -= 8
  tileHLine(10, x, x+4, forestTilesTags.ground, CollisionType.Floor); 

  x += 4
  y = 15
  tileHLine(15, x, x+4, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);

  x += 5
  tileHLine(15, x, x+4, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);

  x += 5
  tileHLine(15, x, x+4, forestTilesTags.ground, CollisionType.Floor); 
  x += 2
  spawnCoin(cx(), cy() + 8);

  x += 6

  x += 5;
  placeGate(x, 1);


  x += 10
  tileHLine(0, fl, x, forestTilesTags.ground, CollisionType.Floor); 


 // spawnGuy(776, 20)
}




function makeLevel5() {
  forestBackground();

  let foreMap = makeTilemap(128, 30);
  tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });

  let x = 3;
  let y = 1;
  
  let cx = () => x * 8 + 4;
  let cy = () => y * 8;


  let fl = x;
  
  tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);


  x += 20
  spawnGuy(cx(), 3 * 8);


  x -= 8
  spawnSherrif(cx(), cy());

  x += 16
  spawnSherrif(cx(), cy());

  x += 12

  tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
  x += 5

  let lt = x;

  repeat(10, () => {
    spawnFlames(cx(), cy());
    x++;
  })

  tilePillar(x, 1, 10, forestTilesTags.stump, forestTilesTags.stumpCap);
  spawnCoin(cx(), 11 * 8);

  x++
  repeat(11, () => {
    spawnFlames(cx(), cy());
    x++;
  })

  x = lt + 2;
  y = 5;

  tileHLine(y, x, x + 4, forestTilesTags.ground, CollisionType.Floor); 

  x += 13;
  tileHLine(y, x, x + 4, forestTilesTags.ground, CollisionType.Floor); 


  x += 20
  y = 1

  spawnSherrif(cx(), cy());

  x += 12
  placeGate(x, 1);

  x += 8
  tileHLine(0, fl, x, forestTilesTags.ground, CollisionType.Floor); 


  //spawnGuy(342, 3 * 8);

}
