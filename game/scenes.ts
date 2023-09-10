interface Scene {
  setup: (s: Scene) => void;
  tick?: (s: Scene) => void;
  nextScene: number;
  endd?: () => void;
  title?: true;
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
  activeChord = chordG;

  s.setup(s);
}

function sceneTick() {
  sceneTime += ds;
  scene.tick?.(scene);

  if (sceneIsComplete) {
    if (!sceneFlags.endd) {
      scene.endd?.();
      sceneFlags.endd = true;
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
    fillStyl(cssPalette[0]);
    globalAlph(1.0 - sceneFader);
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    globalAlph(1);
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
      if (sceneTime > 3) {
        instructionsShow([EventTypes.Start]);
      }

      printText(3, 3, "ROBIN\nOF\nTHIRTEENSLEY");
      if (justPressed[Keys.Attack]) {
        guitarPluck(guitar2, chordG, 1);
        reportEvent(EventTypes.Start);
        sceneComplete();
      }
    },
    nextScene: 2,
    title: true
  },

  { // 1
    setup: () => {
      spawnGuy(0, 0);
      guyCelebrate(0, 0);
      makeDialog(`|THOU HAST WONNETH
|THANK THEE FOR PLAYING!|2`)
    },
    tick: () => {
      if (sceneTime > 10 || justPressed[Keys.Attack]) {
        dialogClear();
        sceneComplete();
      }
    },
    nextScene: 0,
    title: true
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
    endd: () => {
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
    endd: () => {
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
    tick: () => {
      instructionsShow([EventTypes.Parry]);
    },
    endd: () => {
      makeDialog(`J|THAT WAS PRETTY GOOD!`);
    },
    nextScene: 1
  },

]

let scene: Scene;
startScene(4);
