
const enum GuyState {
  Idle,
  Walk,
  Jump,
  Fall,
  Garde,
  Advance,
  Lunge,
  DrawGarde,
  DrawIdle,
  Knockback,
  Celebrate,
  Fake,
  Parry,
}


const guyGardeSmall = 26;
const guyGardeLarge = 52;

const guyAnimRed = makeAnim(guyData);
recolorCels(guyAnimRed, 6);

const guy = {
  anim: guyAnim,
  inst: makeAnimInstance(guyTags.idle, AnimStyle.Loop),
  x: 10, y: 8,
  facing: 1,
  w: 2, h: 12,
  dx: 0, dy: 0,
  timer: 0,
  jumpCount: 0,
  lastFloor: 0,
  state: GuyState.Idle,
  gardeCheck: { x: 0, y: 0, w: guyGardeSmall, h: 12 },
  attackBox: 0 as (Capsule | 0),
  focus: 0 as (Enemy | 0),
  fallTransition: GuyState.Fall,
}


type Guy = typeof guy;
let firstGuy = true;
let spawnGuyLoc: [number, number] | 0 = 0;
let guyRequestedState: GuyState | null = null;
let guyCelebratePosition: WorldCoordinates = [0, 0];

function tickGuy(guy: Guy) {
  const speed = 500 * ds;

  const floor = max(findFloor([guy.x - 2, guy.y]), findFloor([guy.x + 2, guy.y]));

  const jump = (): boolean => {
    if (justPressed[Keys.Up] && guy.jumpCount < 2) {
      guy.y += 0.1;
      guy.dy = 150;
      guy.jumpCount++;
      guy.fallTransition = GuyState.Fall;
      return true;
    }
    return false;
  }

  const horizontal = (mult: number): boolean => {
    if (pressed[Keys.Left]) {
      guy.dx -= speed * mult;
      return true;
    }
    if (pressed[Keys.Right]) {
      guy.dx += speed * mult;
      return true;
    }
    return false;
  }

  const fall = () => {
    if (guy.y > floor || guy.dy != 0) {
      guy.dy -= ds * 500;
      guy.y += guy.dy * ds;
      if (guy.dy < 0) {
        toState(guy.fallTransition);
      }
      return true;
    }
    return false;
  }

  const land = (): boolean => {
    if (guy.y <= floor && guy.dy <= 0) {
      guy.y = floor;
      guy.dy = 0;
      guy.lastFloor = floor;
      guy.jumpCount = 0;
      return true;
    }
    return false;
  }

  const checkGardeBox = (): boolean => {
    let hit = false;
    enemies.forEach(e => {
      if (!e.danger || !e.active) return;
      if (intersectCapsules(e, guy.gardeCheck)) {
        hit = true;
      }
    })
    return hit;
  }

  const checkEnterGarde = () => {
    if (checkGardeBox()) {
      toState(GuyState.DrawGarde);
      guy.gardeCheck.w = guyGardeLarge;
    }
  }

  const checkExitGarde = () => {
    if (!checkGardeBox()) {
      toState(GuyState.DrawIdle);
      guy.gardeCheck.w = guyGardeSmall;
    }
  }

  const checkAttack = (): boolean => {
    return justPressed[Keys.Attack] ? toState(GuyState.Lunge) : false;
  }

  const checkFake = (): boolean => {
    return justPressed[Keys.Down] ? toState(GuyState.Fake) : false;
  }

  const checkParry = (): boolean => {
    return justPressed[Keys.Up] ? toState(GuyState.Parry) : false;
  }

  const checkRPS = (): boolean => {
    return checkAttack() || checkFake() || checkParry();
  }

  const faceFocus = () => {
    let f = guy.focus;
    if (f !== 0) {
      guy.facing = guy.x < f.x ? 1 : -1;
    }
  }

  const toState = (state: GuyState) => {
    guy.anim = guyAnim;
    guy.state = state;
    guy.timer = 0;
    //console.log(`guy to state ${state}`);
    switch (state) {
      case GuyState.Idle:
        animInstanceSetRange(guy.inst, guyTags.idle, AnimStyle.Loop);
        if (absx > 0.2) { toState(GuyState.Walk); }
        checkEnterGarde();
        break;
      case GuyState.Walk:
        animInstanceSetRange(guy.inst, guyTags.run, AnimStyle.Loop);
        break;
      case GuyState.Jump:
        animInstanceResetRange(guy.inst, guyTags.jump, AnimStyle.Loop);
        break;
      case GuyState.Fall:
        animInstanceSetRange(guy.inst, guyTags.fall, AnimStyle.Loop);
        break;
      case GuyState.Garde:
        animInstanceSetRange(guy.inst, guyTags.garde, AnimStyle.Loop);
        break;
      case GuyState.Advance:
        animInstanceSetRange(guy.inst, guyTags.advance, AnimStyle.Loop);
        break;
      case GuyState.Lunge:
        guy.dx = guy.facing * 150;
        animInstanceResetRange(guy.inst, guyTags.lunge, AnimStyle.NoLoop);
        break;
      case GuyState.Fake:
        guy.dx = guy.facing * 100;
        animInstanceResetRange(guy.inst, guyTags.fake, AnimStyle.NoLoop);
        break;
      case GuyState.Parry:
        guy.dx = guy.facing * -50;
        animInstanceResetRange(guy.inst, guyTags.parry, AnimStyle.NoLoop);
        break;
      case GuyState.DrawGarde:
      case GuyState.DrawIdle:
        animInstanceResetRange(guy.inst, guyTags.draw, AnimStyle.NoLoop);
        break;
      case GuyState.Knockback:
        guy.anim = guyAnimRed;
        guy.fallTransition = GuyState.Knockback;
        animInstanceSetRange(guy.inst, guyTags.fall, AnimStyle.Loop);
        break;
      case GuyState.Celebrate:
        animInstanceSetRange(guy.inst, guyTags.victory, AnimStyle.Loop);
        break;
    }
    return true;
  }

  if (firstGuy) {
    toState(GuyState.Garde);
    firstGuy = false;
  }

  if (spawnGuyLoc) {
    toState(GuyState.Idle);
    guy.x = spawnGuyLoc[0];
    guy.y = spawnGuyLoc[1];
    guy.dx = 0;
    guy.dy = 0;
    guy.lastFloor = findFloor([guy.x, guy.y]);
    cameraCutTo(guy.x, guy.y);
    spawnGuyLoc = 0;
  }

  let closestDist = 9999999;
  let closest: Enemy | 0 = 0;
  enemies.forEach(e => {
    if (!e.danger || !e.active) return;
    let dx = abs(e.x - guy.x);
    let dy = abs(e.y - guy.y);
    if (dx < closestDist && dy < 16) {
      closestDist = dx;
      closest = e;
    }
  })
  guy.focus = closest;

  guy.timer += ds;

  if (guyRequestedState !== null) {
    toState(guyRequestedState);
    guyRequestedState = null;
  }

  const absx = abs(guy.dx * ds);
  let canFace = true;
  guy.attackBox = 0;
  switch (guy.state) {
    case GuyState.Idle:
      if (horizontal(1)) toState(GuyState.Walk);
      if (jump()) toState(GuyState.Jump);
      checkEnterGarde();
      fall();
      break;
    case GuyState.Walk:
      if (guy.timer > 0.25) {
        reportEvent(EventTypes.Move);
      }
      horizontal(1);
      if (absx < 0.1) toState(GuyState.Idle);
      if (jump()) toState(GuyState.Jump);
      checkEnterGarde();
      fall();
      break;
    case GuyState.Jump:
      horizontal(0.75);
      fall();
      jump();
      break;
    case GuyState.Fall:
      fall();
      if (land()) { toState(GuyState.Idle) }
      else if (jump()) { toState(GuyState.Jump) }
      break;
    case GuyState.Garde:
      reportEvent(EventTypes.GuyGarde);
      canFace = false;
      faceFocus();
      if (horizontal(0.5)) toState(GuyState.Advance);
      checkRPS()
      checkExitGarde();
      fall();
      break;
    case GuyState.Advance:
      canFace = false;
      faceFocus();
      horizontal(0.5);
      if (absx < 0.1) toState(GuyState.Garde);
      checkRPS()
      checkExitGarde();
      fall();
      break;
    case GuyState.Lunge:
      canFace = false;
      if (animIsRelativeFrame(guy.inst, 0)) {
        guy.attackBox = { x: guy.x + guy.facing * 8, y: guy.y, w: 9, h: 12 };
      }
      if (animIsFinished(guy)) toState(GuyState.Garde)
      break;
    case GuyState.Fake:
      canFace = false;
      if (animIsFinished(guy)) toState(GuyState.Garde)
      break;
    case GuyState.Parry:
      canFace = false;
      if (animIsFinished(guy)) toState(GuyState.Garde)
      break;
    case GuyState.DrawGarde:
      canFace = false;
      if (animIsFinished(guy)) toState(GuyState.Garde)
      break;
    case GuyState.DrawIdle:
      canFace = false;
      if (animIsFinished(guy)) toState(GuyState.Idle)
      break;
    case GuyState.Knockback:
      guy.anim = sin(guy.timer * 70) > 0 ? guyAnimRed : guyAnim;
      canFace = false;
      fall();
      if (land()) { toState(GuyState.Idle) }
      break;
    case GuyState.Celebrate:
      guy.dx = 0;
      guy.dy = 0;
      let t = 1 - pow(0.01, ds);
      guy.x += (guyCelebratePosition[0] - guy.x) * t;
      guy.y += (guyCelebratePosition[1] - guy.y) * t;
      break;
  }

  guy.dx *= pow(0.01, ds);
  guy.x = moveHorizontalAgainstTilemap(guy.x, guy.y, guy.w, guy.dx * ds);

  if (canFace) {
    guy.facing = guy.dx >= 0 ? 1 : -1;
  }

  if (guy.y <= DeathFloor + 1) {
    sceneDeath();
  }

  enemies.forEach(e => {
    if (!e.danger || !e.active) return;
    if (intersectCapsules(guy, e)) {
      toState(GuyState.Knockback);
      guy.dx = guy.x < e.x ? -150 : 150;
      guy.dy = 100;
    }
  })

  guy.gardeCheck.x = guy.x;
  guy.gardeCheck.y = guy.y;

  animInstanceTick(guy.anim, guy.inst);

  cameraSetTarget(
    guy.x + guy.dx / 4,
    guy.lastFloor + (guy.y - guy.lastFloor) / 4 + 10
  );

  //cameraSetTarget(0, 0);
}

function guyDraw(guy: Guy) {
  applyCameraPos(guy.x, guy.y);
  if (guy.facing < 0) {
    flipHorizontal();
  }
  drawAnim(guy.anim, guy.inst.frame, -16, -24);
}

function guyCelebrate(x: number, y: number) {
  if (guy.state !== GuyState.Celebrate) {
    guyRequestedState = GuyState.Celebrate;
    guyCelebratePosition = [x, y];
  }
}

function spawnGuy(x: number, y: number) {
  guy.state = GuyState.Idle;
  spawnGuyLoc = [x, y];
}

