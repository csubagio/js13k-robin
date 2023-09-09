interface Scene {
  setup: (s: Scene) => void;
  tick?: (s: Scene) => void;
  nextScene: number;
  finished?: () => void;
}

let sceneTime = 0;
let sceneFader = 0;
let sceneIsComplete = false;
let currentScene = -1;
let sceneFlags: Record<string, true> = {};

function startScene(index: number) {
  currentScene = index;  
  let s = scenes[index];
  enemiesClear()
  tilemapsClear();
  dialogClear();
  instructionsSnapshot();
  
  sceneTime = 0;
  sceneFader = 0;
  scene = s; 
  sceneIsComplete = false;
  sceneFlags = {};

  s.setup(s);
}

function sceneTick() {
  sceneTime += ds;
  scene.tick?.(scene);

  if (sceneIsComplete) {
    if (!sceneFlags.finished) {
      scene.finished?.();
      sceneFlags.finished = true;
    }
    if (dialogIsComplete()) {
      sceneFader -= ds * 3;
      if (sceneFader < 0) {
        sceneFader = 0;
        startScene(scene.nextScene);
      }
    }
  } else {
    sceneFader = min(sceneFader + ds, 1);
  }

  if (sceneFader < 1) {
    ctx.fillStyle = cssPalette[0];
    ctx.globalAlpha = 1.0 - sceneFader;
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.globalAlpha = 1;
  }
}

function sceneComplete() {
  sceneIsComplete = true;
}

function sceneDeath() {
  instructionsRestore();
  startScene(currentScene);
}

const scenes: Scene[] = [

  { // 0
    setup: (s) => {
      spawnGuy(0, 0);
    },
    tick: () => {  
      if (sceneTime > 3 && !sceneFlags.instructions) {
        sceneFlags.instructions = true;
        makeDialog(`|PRESSETH SPACE TO START|2`);
      }

      printText(3, 3, "ROBIN\nOF\nTHIRTEENSLEY");
      if (justPressed[Keys.Attack]) {
        sceneComplete();
      }
    },
    nextScene: 2
  },

  { // 1
    //title: ["THOU HAST WONNETH!", "THANK THEE FOR PLAYINGST"],
    setup: () => {
      //playSong(songEnd);
      spawnGuy(0, 0);
      guyCelebrate(0, 0);
    },
    tick: () => {
      if (sceneTime > 10 || justPressed[Keys.Attack]) {
        sceneComplete();
      }
    },
    nextScene: 0
  },


  { // 2
    setup: () => {
      makeLevel1();
      //playSong(songJangle);
      makeDialog(`J|HAH, YOU THINK YOU CAN JOIN OUR BAND?!
J|PROVE IT. COLLECT ALL THE COIN`);
    },
    tick: () => {
      instructionsShow([EventTypes.Move, EventTypes.Jump]);
      if (coinCounter >= coinsTotal) {
        instructionsShow([EventTypes.Exit]);        
      }
    },
    finished: () => {
      makeDialog(`J|A MONKEY COULD HAVE DONE THAT...`);
    },
    nextScene: 3
  },

  { // 3
    setup: () => {
      makeLevel2();
      makeDialog(`J|OK, COINS DON'T JUST GROW ON TREES
J|SKEWER THESE TRAINING DUMMIES`);
    },
    tick: () => {
      instructionsShow([EventTypes.GuyGarde, EventTypes.Lunge]);
    },
    finished: () => {
      makeDialog(`J|WELL MAYBE YOU'RE NOT HOPELESS...`);
    },
    nextScene: 4
  },

  { // 4
    setup: () => {
      makeLevel3();
      makeDialog(`J|LET'S TRY A REAL FIGHT
J|WILL, GET OVER HERE!`);
    },
    finished: () => {
      makeDialog(`J|THAT WAS PRETTY GOOD!`);
    },
    nextScene: 2
  },

]

let scene: Scene;
startScene(2);
