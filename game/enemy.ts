


type Callback = () => void;
type EnemyStates = CoinState | DummyState | GateState | MerryStates;

type EnemyCallback = (e: Enemy) => void;
type EnemyCallbackMap = Record<EnemyStates | number, EnemyCallback | 0>;


interface Enemy {
  x: number, y: number;
  w: number, h: number;
  anim: Anim;
  inst: AnimInstance;
  onStateChange: EnemyCallbackMap;
  onTick: EnemyCallbackMap;
  onIntersect: EnemyCallbackMap;

  timer: number;
  state: EnemyStates;
  danger: boolean;
  facing: number;
  health: number;
  actv: boolean;

  dx: number;

  detect?: Capsule;
  attack?: Capsule;
}

let enemies: Enemy[] = [];

function makeEnemy(
  x: number, y: number, w: number, h: number,
  anim: Anim, range: AnimRange,
  onStateChange: EnemyCallbackMap,
  onTick: EnemyCallbackMap,
  onIntersect: EnemyCallbackMap,
): Enemy {
  let e: Enemy = {
    anim, inst: makeAnimInstance(range, AnimStyle.Loop),
    x, y, w, h,
    onStateChange,
    onTick,
    onIntersect,

    timer: 0,
    state: 0,
    danger: true,
    facing: 1,
    health: 2,
    actv: true,

    dx: 0
  }
  enemySetState(e, 0);
  enemies.push(e);
  return e;
}

function dispatchEnemyMap(map: EnemyCallbackMap, e: Enemy) {
  let c = map[e.state];
  if (c) { c(e) }
}

const enum EnemyIntersectionType {
  GuyTouch,
  GuyAttack,
  GuyDetected,
}

let enemyIntersectionType = EnemyIntersectionType.GuyTouch;

function enemiesTick() {
  let hitlanded = false;
  enemies.forEach(e => {
    if (e.actv) {
      e.timer += ds;
      dispatchEnemyMap(e.onTick, e);
      let guyAttack = guy.attackBox;
      if (guyAttack !== 0 && intersectCapsules(guyAttack, e)) {
        enemyIntersectionType = EnemyIntersectionType.GuyAttack;
        dispatchEnemyMap(e.onIntersect, e);
        hitlanded = true;
      } else if (intersectCapsules(guy, e)) {
        enemyIntersectionType = EnemyIntersectionType.GuyTouch;
        dispatchEnemyMap(e.onIntersect, e);
      } else if (e.detect && intersectCapsules(e.detect, guy)) {
        enemyIntersectionType = EnemyIntersectionType.GuyDetected;
        dispatchEnemyMap(e.onIntersect, e);
      }
      animInstanceTick(e.anim, e.inst);
    }
  })
  if (hitlanded) {
    reportEvent(EventTypes.Lunge);
    guy.dx *= 0.5;
  }
}

function enemySetState(e: Enemy, s: EnemyStates) {
  e.state = s;
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
  let coin = makeEnemy(
    x, y, 3, 8, coinAnim, coinTags.idle,
    {
      [CoinState.Idle]: (e) => {
        e.danger = false;
        e.timer = random() * 5;
        e.inst.loop = AnimStyle.PingPong;
      },
      [CoinState.PickedUp]: (e) => {
        coinCounter++;
        e.inst.frm = 0;
        //zzfx(...[,0,1e3,.1,.2,.33,1,.3,13.9,.1,500,.12,.08,,,,,.89,.01]);
        guitarPluck([, , , , pickIntRange([10, 15])], 1);
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
  coin.actv = actv;
  return coin;
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
    {
      [DummyState.Idle]: (e) => {
        animInstanceSetRange(e.inst, dummyTags.idle, AnimStyle.PingPong);
        e.inst.loop = AnimStyle.PingPong;
        e.danger = true;
      },
      [DummyState.Hit]: (e) => {

      },
      [DummyState.Dead]: (e) => {
        guitarPluck([, 3, 2, 0, 1, 0], 0.5);
        e.danger = false;
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
        if (enemyIntersectionType === EnemyIntersectionType.GuyAttack) {
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
    {
      [GateState.Closed]: (e) => { e.danger = false; },
      [GateState.Celebrating]: (e) => {
        guyCelebrate(x, y);
        reportEvent(EventTypes.Exit);
        guitarPluck([3, 2, 0, 0, 0, 3], 0.5);
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
        if (enemyIntersectionType === EnemyIntersectionType.GuyTouch) {
          enemySetState(e, GateState.Shudder)
        }
      },
      [GateState.Open]: (e) => {
        if (enemyIntersectionType === EnemyIntersectionType.GuyTouch) {
          enemySetState(e, GateState.Celebrating);
        }
      },
    }
  );
}


enum MerryStates {
  Idle,
  Garde,
  Advance,
  Flinch,
  Hit,
}

function spawnMerry(x: number, y: number) {
  let coin = spawnCoin(x, y, false);
  return makeEnemy(x, y, 6, 12,
    merryAnim, merryTags.idle,
    {
      [MerryStates.Idle]: (e) => { },
      [MerryStates.Garde]: (e) => {
        animInstanceSetRange(e.inst, merryTags.garde, AnimStyle.PingPong);
      },
      [MerryStates.Advance]: (e) => {
        animInstanceSetRange(e.inst, merryTags.advance, AnimStyle.Loop);
      },
      [MerryStates.Hit]: (e) => {
        animInstanceSetRange(e.inst, merryTags.hit, AnimStyle.NoLoop);
        e.health--;
        if (e.health <= 0) {
          e.actv = false;
          coinAppear(coin, e.x, e.y);
        }
      },
    },
    {
      [MerryStates.Idle]: (e) => {
        enemyFacePlayer(e);
        enemyDetect(e, 0, e.facing * 40);
      },
      [MerryStates.Garde]: (e) => {
        if (enemyCheckStandoff(e, 20, 30)) {
          enemySetState(e, MerryStates.Advance);
        }
      },
      [MerryStates.Advance]: (e) => {
        if (enemyAdjustStandoff(e, 21, 29, 20)) {
          enemySetState(e, MerryStates.Garde);
        }
      },
      [MerryStates.Hit]: (e) => {
        if (animIsFinished(e)) enemySetState(e, MerryStates.Garde);
      },
    },
    {
      [MerryStates.Idle]: (e) => {
        enemySetState(e, MerryStates.Garde);
      },
      [MerryStates.Garde]: (e) => {
        if (enemyIntersectionType === EnemyIntersectionType.GuyAttack) {
          enemySetState(e, MerryStates.Hit);
        }
      },
      [MerryStates.Advance]: (e) => {
        if (enemyIntersectionType === EnemyIntersectionType.GuyAttack) {
          enemySetState(e, MerryStates.Hit);
        }
      }
    }
  )
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
    e.inst.loop = AnimStyle.LoopReverse;
    return false;
  }
  if (gx > far) {
    e.x += e.facing * speed * ds;
    e.inst.loop = AnimStyle.Loop;
    return false;
  }
  return true;
}

function enemyDetect(e: Enemy, ox1: number, ox2: number) {
  let w = (ox2 - ox1) / 2;
  e.detect = { x: e.x + ox1 + w, y: e.y, w: abs(w), h: e.h }
}
