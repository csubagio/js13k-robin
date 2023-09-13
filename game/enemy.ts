


type Callback = () => void;
type EnemyStates = CoinState | DummyState | GateState | MerryStates | EnemyGeneralStates | PiggyState | SpikeStates;

type EnemyCallback = (e: Enemy) => void;
type EnemyCallbackMap = Record<EnemyStates | number, EnemyCallback | 0>;


const enum EnemyGeneralStates {
  Any = 100,
}


interface Enemy {
  x: number, y: number;
  w: number, h: number;
  anim: Anim;
  inst: AnimInstance;
  onStateChange: EnemyCallbackMap;
  onTick: EnemyCallbackMap;
  onIntersect: EnemyCallbackMap;

  timer: number;
  actionTimer: number;
  stat: EnemyStates;
  danger: boolean;
  facing: number;
  health: number;
  actv: boolean;
  blocker: boolean;
  
  dx: number;
  
  fighter?: boolean;
  detect?: Capsule;
  attack?: Capsule;
}

let enemies: Enemy[] = [];

function makeEnemy(
  x: number, y: number, w: number, h: number,
  anim: Anim, rnge: AnimRange,
  onSpawn: (e: Enemy) => void,
  onStateChange: EnemyCallbackMap,
  onTick: EnemyCallbackMap,
  onIntersect: EnemyCallbackMap,
): Enemy {
  let e: Enemy = {
    anim, inst: makeAnimInstance(rnge, AnimStyle.Loop),
    x, y, w, h,
    onStateChange,
    onTick,
    onIntersect,

    timer: 0,
    actionTimer: 0,
    stat: 0,
    danger: true,
    blocker: true,
    facing: 1,
    health: 2,
    actv: true,

    dx: 0
  }
  enemySetState(e, 0);
  enemies.push(e);
  onSpawn(e);
  return e;
}

function dispatchEnemyMap(map: EnemyCallbackMap, e: Enemy) {
  let c = map[e.stat];
  if (c) { c(e) }
  c = map[EnemyGeneralStates.Any];
  if (c) { c(e) }
}

const enum EnemyIntersectionType {
  GuyTouch,
  GuyAttack,
  GuyDetected,
  EnemyAttack,
  GuyParried,
  GuyFeinted,
}

let enemyIntersectionType = EnemyIntersectionType.GuyTouch;

const isIntersection = (t: EnemyIntersectionType) => t === enemyIntersectionType;

function enemiesTick() {
  let hitlanded = false;
  enemies.forEach(e => {
    if (e.actv && guy.actv) {
      e.detect = void 0;
      e.attack = void 0;

      e.timer += ds;
      e.actionTimer += ds;
      dispatchEnemyMap(e.onTick, e);

      if (intersectCapsules(guy.attackBox, e)) {
        enemyIntersectionType = EnemyIntersectionType.GuyAttack;
        dispatchEnemyMap(e.onIntersect, e);
        hitlanded = true;
      }
      
      if (intersectCapsules(guy, e)) {
        enemyIntersectionType = EnemyIntersectionType.GuyTouch;
        dispatchEnemyMap(e.onIntersect, e);
      }
      
      if (intersectCapsules(e.detect, guy)) {
        enemyIntersectionType = EnemyIntersectionType.GuyDetected;
        dispatchEnemyMap(e.onIntersect, e);
      }
      
      if (intersectCapsules(e.attack, guy)) {
        console.log('ouch')
        enemyIntersectionType = EnemyIntersectionType.EnemyAttack;
        dispatchEnemyMap(e.onIntersect, e);
        guyTakeDamage(e);
      }
      
      if (intersectCapsules(e.attack, guy.parryBox)) {
        enemyIntersectionType = EnemyIntersectionType.GuyParried;
        dispatchEnemyMap(e.onIntersect, e);
        guyParrySuccess(e);
      }

      if (intersectCapsules(e, guy.feintBox)) {
        enemyIntersectionType = EnemyIntersectionType.GuyFeinted;
        dispatchEnemyMap(e.onIntersect, e);
        guyFeintSuccess(e);
      }

      animInstanceTick(e.anim, e.inst);
    }
  })
  if (hitlanded) {
    guitarTwoStrings(1, 1);
    reportEvent(EventTypes.Lunge);
    guyHitLanded();
  }
}

function enemySetState(e: Enemy, s: EnemyStates) {
  //console.log(`${e.stat} => ${s}`)
  e.stat = s;
  e.timer = 0;
  dispatchEnemyMap(e.onStateChange, e);
}

function enemiesDraw() {
  enemies.forEach(e => {
    if (e.actv) {
      applyCameraPos(e.x, e.y);
      if (e.facing < 0) {
        flipHorizontal();
      }
      drawAnim(e.anim, e.inst.frm, -16, -24);
    }
  })
}

function enemiesClear() {
  enemies = [];
  coinsTotal = 0;
  coinCounter = 0;
}

function enemyCheckStandoff(e: Enemy, near: number, far: number) {
  let gx = abs(guy.x - e.x);
  return gx < near || gx > far;
}

function enemyAdjustStandoff(e: Enemy, near: number, far: number, speed: number) {
  enemyFacePlayer(e);
  let gx = abs(guy.x - e.x);
  if (gx < near) {
    e.x -= e.facing * speed * ds;
    e.inst.styl = AnimStyle.LoopReverse;
    return false;
  }
  if (gx > far) {
    e.x += e.facing * speed * ds;
    e.inst.styl = AnimStyle.Loop;
    return false;
  }
  return true;
}


function enemyActionTimer(e: Enemy, tme: number, func: () => void) {
  if (e.actionTimer > tme) {
    e.actionTimer = 0;
    func();
  }
}











const enum CoinState {
  Idle,
  Appear,
  PickedUp,
  Leaving,
}

let coinCounter = 0;
let coinsTotal = 0;

fillCels(coinAnim, 10);

function spawnCoin(x: number, y: number, actv: boolean = true, onPickup = () => { }) {
  coinsTotal++;
  return makeEnemy(
    x, y, 3, 8, coinAnim, coinTags.idle,
    (e) => {
      e.actv = actv;
      e.blocker = false;
    },
    {
      [CoinState.Idle]: (e) => {
        e.danger = false;
        e.timer = random() * 5;
        e.inst.styl = AnimStyle.PingPong;
      },
      [CoinState.PickedUp]: (e) => {
        coinCounter++;
        e.inst.frm = 0;
        guitarSingleString(1, [4,5], 1);        
        animInstanceSetRange(e.inst, coinTags.idle, AnimStyle.NoLoop);
        enemySetState(e, CoinState.Leaving);
        onPickup();
      }
    },
    {
      [CoinState.Idle]: (e) => {
        e.y = y + abs(sin(e.timer * PI * 3)) * 3;
      },
      [CoinState.Appear]: (e) => {
        let t = e.timer;
        let height = 20 - t * 17;
        e.x += ds * e.dx;
        e.y = y + abs(sin(t * PI * 3)) * height;
        if (t >= 1) {
          enemySetState(e, CoinState.Idle);
        }
      },
      [CoinState.Leaving]: (e) => {
        e.y = y + pow(e.timer, 0.5) * 35;
        if (e.timer > 0.5) {
          enemies = enemies.filter(en => en != e);
        }
      }
    },
    {
      [CoinState.Idle]: (e) => {
        enemySetState(e, CoinState.PickedUp);
      },
      [CoinState.Appear]: (e) => {
        if (e.timer > 1) {
          enemySetState(e, CoinState.PickedUp);
        }
      },
    }
  );
}

function coinAppear(e: Enemy, x: number, y: number) {
  e.actv = true;
  e.x = x;
  e.y = y;
  e.dx = x > guy.x ? 30 : -30;
  enemySetState(e, CoinState.Appear);
}







const enum DummyState {
  Idle,
  Hit,
  Dead,
}

function enemyFacePlayer(e: Enemy) {
  e.facing = guy.x > e.x ? 1 : -1;
}

//fillCels(dummyAnim, 6);
function spawnDummy(x: number, y: number) {
  let coin = spawnCoin(x, y, false);
  return makeEnemy(
    x, y, 4, 16,
    dummyAnim, dummyTags.idle,
    (e) => { 
      e.fighter = true;
    },
    {
      [DummyState.Idle]: (e) => {
        animInstanceSetRange(e.inst, dummyTags.idle, AnimStyle.PingPong);
        e.inst.styl = AnimStyle.PingPong;
        e.danger = true;
      },
      [DummyState.Hit]: (e) => {

      },
      [DummyState.Dead]: (e) => {
        activeChord = chordBm
        guitarPluck(1, activeChord, 1);
        e.danger = false;
        e.blocker = false;
        e.fighter = false;
      }
    },
    {
      [DummyState.Idle]: (e) => {
        enemyFacePlayer(e);
      },
      [DummyState.Hit]: (e) => {
        if (animIsFinished(e)) {
          enemySetState(e, DummyState.Idle);
        }
      },
      [DummyState.Dead]: (e) => {
        if (e.timer > 5) {
          //enemySetState(e, DummyState.Idle);
          //e.health = 2;
        }
      },
    },
    {
      [DummyState.Idle]: (e) => {
        if (isIntersection(EnemyIntersectionType.GuyAttack)) {
          e.health -= 1;
          if (e.health === 0) {
            animInstanceResetRange(e.inst, dummyTags.death, AnimStyle.NoLoop);
            enemySetState(e, DummyState.Dead)
            coinAppear(coin, e.x, e.y);
          } else {
            animInstanceResetRange(e.inst, dummyTags.hit, AnimStyle.NoLoop);
            enemySetState(e, DummyState.Hit)
          }
        }
      },
      [DummyState.Hit]: 0,
      [DummyState.Dead]: 0,
    }
  );
}



const enum GateState {
  Closed,
  Shudder,
  Opening,
  Open,
  Celebrating,
}

const gateTile1 = forestTilesTags.gate[0];
const gateTile2 = forestTilesTags.gateCap[0];

const gateAnim: Anim = {
  cels: [composeTiles(forestTilesAnim, 5, -8, 3, 4, [
    gateTile2, gateTile2, gateTile2,
    gateTile1, gateTile1, gateTile1,
    gateTile1, gateTile1, gateTile1,
    gateTile1, gateTile1, gateTile1,
  ])]
}

function spawnGate(x: number, y: number) {
  return makeEnemy(
    x, y, 12, 64,
    gateAnim, [0, 0],
    (e) => { 
      e.blocker = false;
    },
    {
      [GateState.Closed]: (e) => { e.danger = false; },
      [GateState.Celebrating]: (e) => {
        guyCelebrate(x, y);
        reportEvent(EventTypes.Exit);
        guitarArp(1, chordG);
      }
    },
    {
      [GateState.Closed]: (e) => {
        if (coinCounter >= coinsTotal) {
          enemySetState(e, GateState.Opening)
        }
      },
      [GateState.Opening]: (e) => {
        let t = lerpInRange(0, 1.2, e.timer);
        e.x = x + random() * 2 - 1;
        e.y = y - t * 28;
        if (t >= 1) {
          e.x = x;
          enemySetState(e, GateState.Open)
        }
      },
      [GateState.Shudder]: (e) => {
        e.x = x;
        if (e.timer < 0.5) {
          e.x = x + random() * 2 - 1;
        }
        if (e.timer > 2) {
          enemySetState(e, GateState.Closed);
        }
      },
      [GateState.Celebrating]: (e) => {
        if (e.timer > 1) {
          sceneComplete();
        }
      }
    },
    {
      [GateState.Closed]: (e) => {
        if (isIntersection(EnemyIntersectionType.GuyTouch)) {
          enemySetState(e, GateState.Shudder)
        }
      },
      [GateState.Open]: (e) => {
        if (isIntersection(EnemyIntersectionType.GuyTouch)) {
          enemySetState(e, GateState.Celebrating);
        }
      },
    }
  );
}


const enum MerryStates {
  Idle,
  Garde,
  Advance,
  Flinch,
  Hit,
  Windup = 5,
  Lunge,
  Parry,
  Dead,
  Dodge,
}

const sherrifAnim = makeAnim(merryData);
recolorCels(sherrifAnim, 8);

function spawnSherrif(x: number, y: number) {
  let sherrif = spawnMerry(x, y);
  sherrif.anim = sherrifAnim;
}

function spawnMerry(x: number, y: number) {
  let coin = spawnCoin(x, y, false);
  let flags = {
    fighting: false,
    vulnerable: false
  };
  return makeEnemy(x, y, 6, 10,
    merryAnim, merryTags.idle,
    (e) => {
      e.health = 5;
      e.fighter = true;
    },
    {
      [MerryStates.Idle]: (e) => {
        flags.fighting = false;
        flags.vulnerable = true;
      },
      [MerryStates.Garde]: (e) => {
        animInstanceSetRange(e.inst, merryTags.garde, AnimStyle.PingPong);
        if (!flags.fighting) {
          e.actionTimer = 2;
        }
        flags.fighting = true;
        flags.vulnerable = true;
      },
      [MerryStates.Advance]: (e) => {
        animInstanceSetRange(e.inst, merryTags.advance, AnimStyle.Loop);
      },
      [MerryStates.Hit]: (e) => {
        e.dx = -e.facing * 50;
        animInstanceResetRange(e.inst, merryTags.hit, AnimStyle.NoLoop);
        e.health--;
        if (e.health <= 0) {
          activeChord = chordBm;
          guitarPluck(1, activeChord, 1);
          coinAppear(coin, e.x, e.y);
          enemySetState(e, MerryStates.Dead);
        }
        flags.vulnerable = false;
      },
      [MerryStates.Windup]: (e) => {
        animInstanceResetRange(e.inst, merryTags.windup, AnimStyle.NoLoop);
      },
      [MerryStates.Lunge]: (e) => {
        e.dx = e.facing * 50;
        animInstanceResetRange(e.inst, merryTags.lunge, AnimStyle.NoLoop);
      },
      [MerryStates.Flinch]: (e) => {
        animInstanceResetRange(e.inst, merryTags.flinch, AnimStyle.NoLoop);
      },
      [MerryStates.Parry]: (e) => {
        animInstanceResetRange(e.inst, merryTags.parry, AnimStyle.NoLoop);
        flags.vulnerable = false;
      },
      [MerryStates.Dead]: (e) => {
        animInstanceResetRange(e.inst, merryTags.death, AnimStyle.NoLoop);
        e.blocker = false;
        e.danger = false;
        e.fighter = false;
      },
      [MerryStates.Dodge]: (e) => {
        animInstanceResetRange(e.inst, merryTags.advance, AnimStyle.LoopReverse);
        e.dx = e.facing * -100;
        e.actionTimer -= 1;
      }
    },
    {
      [MerryStates.Idle]: (e) => {
        enemyFacePlayer(e);
        e.detect = capsuleAhead(e, 0, 40);
      },
      [MerryStates.Garde]: (e) => {
        e.danger = true;
        if (enemyCheckStandoff(e, 20, 30)) {
          enemySetState(e, MerryStates.Advance);
        }
        enemyActionTimer(e, 3, () => enemySetState(e, MerryStates.Windup));
      },
      [MerryStates.Advance]: (e) => {
        if (enemyAdjustStandoff(e, 21, 29, 20)) {
          enemySetState(e, MerryStates.Garde);
        }
        enemyActionTimer(e, 3, () => enemySetState(e, MerryStates.Windup));
      },
      [MerryStates.Hit]: (e) => {
        e.danger = false;
        e.x += e.dx * ds;
        e.dx -= e.dx * ( 1 - pow(0.01, ds) );
        if (animIsFinished(e)) enemySetState(e, MerryStates.Garde);
      },
      [MerryStates.Windup]: (e) => {
        if (animIsFinished(e)) {
          enemySetState(e, MerryStates.Lunge);
        }
      },
      [MerryStates.Lunge]: (e) => {
        e.x += e.dx * ds;
        e.dx -= e.dx * ( 1 - pow(0.01, ds) );
        e.attack = capsuleAhead(e, 0, 12);
        if (animIsFinished(e)) {
          e.actionTimer = 0;
          enemySetState(e, MerryStates.Garde);
        }
      },
      [MerryStates.Flinch]: (e) => {
        e.danger = false;
        if (animIsFinished(e)) {
          e.actionTimer = 0;
          enemySetState(e, MerryStates.Garde);
        }
      },
      [MerryStates.Parry]: (e) => {
        if (animIsFinished(e)) {
          enemySetState(e, MerryStates.Garde);
        }
        enemyActionTimer(e, 3, () => enemySetState(e, MerryStates.Windup));
      },
      [MerryStates.Dodge]: (e) => {
        e.x += e.dx * ds;
        e.dx -= e.dx * (1 - pow(0.001, ds));
        if (e.dx < 5) {
          enemySetState(e, MerryStates.Garde);
        }
      }
    },
    {
      [EnemyGeneralStates.Any]: (e) => {
        if (isIntersection(EnemyIntersectionType.GuyAttack) && flags.vulnerable) {
          if (
            !contains([MerryStates.Flinch, MerryStates.Hit], e.stat)
            && ( random() > 0.2 || !instructionsComplete[EventTypes.Parry] )
          )
          {
            guysHitWasParried();
            enemySetState(e, MerryStates.Parry);
          } else {
            enemySetState(e, MerryStates.Hit);
          }
        }
        if (isIntersection(EnemyIntersectionType.GuyParried)) {
          enemySetState(e, MerryStates.Flinch);
        }
        if (isIntersection(EnemyIntersectionType.GuyFeinted) && contains([MerryStates.Garde, MerryStates.Advance], e.stat)) {
          if (random() < 0.4) {
            enemySetState(e, MerryStates.Dodge);
          } else if (random() < 0.8) {
            enemySetState(e, MerryStates.Flinch);
          } else {
            enemySetState(e, MerryStates.Lunge);
          }
        }
      },
      [MerryStates.Idle]: (e) => {
        if (isIntersection(EnemyIntersectionType.GuyDetected)) {
          enemySetState(e, MerryStates.Garde);
        }
      },
    }
  )
}




const enum PiggyState {
  Idle,
  Sniffing,
  Charging,
}

function spawnPiggy(x: number, y: number, facing: number) {
  return makeEnemy(
    x, y, 8, 11,
    piggyAnim, piggyTags.idle, 
    (e) => {
      e.facing = facing;
      e.danger = true;
      e.blocker = true;
    },
    {
      [PiggyState.Idle]: (e) => {
        animInstanceResetRange(e.inst, piggyTags.idle, AnimStyle.Loop);
      },
      [PiggyState.Sniffing]: (e) => {
        animInstanceResetRange(e.inst, piggyTags.sniff, AnimStyle.Loop);
      },
      [PiggyState.Charging]: (e) => {
        animInstanceResetRange(e.inst, piggyTags.run, AnimStyle.Loop);
      },
    },
    {
      [PiggyState.Idle]: (e) => {
        e.detect = capsuleAhead(e, -24, 40);
      },
      [PiggyState.Sniffing]: (e) => {
        if (e.timer > 3) {
          enemySetState(e, PiggyState.Charging);
        }
      },
      [PiggyState.Charging]: (e) => {
        e.attack = capsuleAhead(e, 0, 12);
        let tx = e.x + e.facing * 50 * ds;
        if (findFloor([tx, 10]) === e.y) {
          e.x += e.facing * 50 * ds;
        }
        if (e.timer > 3) {
          enemySetState(e, PiggyState.Idle);
        }
      }
    },
    {
      [PiggyState.Idle]: (e) => {
        enemySetState(e, PiggyState.Sniffing);
        enemyFacePlayer(e);
      },
    }
  );
}



const enum SpikeStates {
  Waiting,
  Sprung
}

function spawnSpikes(x:number, y:number, phase:number) {
  return makeEnemy(
    x, y, 8, 12,
    spikeAnim, spikeTags.pop,
    (e) => {
      e.danger = false;
      e.blocker = false;
      e.timer = phase % 3;
    },
    {
      [SpikeStates.Waiting]: (e) => {
        animInstanceSetRange(e.inst, spikeTags.pop, AnimStyle.NoLoopReverse);
      },
      [SpikeStates.Sprung]: (e) => {
        animInstanceSetRange(e.inst, spikeTags.pop, AnimStyle.NoLoop);
      },
    },
    {
      [SpikeStates.Waiting]: (e) => {
        e.danger = false;
        if (e.timer > 3) {
          enemySetState(e, SpikeStates.Sprung)
        }
      },
      [SpikeStates.Sprung]: (e) => {
        e.danger = true;
        if (e.timer > 3) {
          enemySetState(e, SpikeStates.Waiting)
        }
      }
    },
    {
    }
  )
}



const enum FlameStates {
  Burning,
}

function spawnFlames(x:number, y:number) {
  return makeEnemy(
    x, y, 4, 8,
    flamesAnim, flamesTags.burning,
    (e) => {
      e.danger = true;
      e.blocker = false;
      e.inst.tme = random() * 5;
    },
    {},
    {},
    {}
  )
}
