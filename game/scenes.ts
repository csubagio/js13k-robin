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
let sceneFlags: Record<string, boolean> = {};

function startScene(index: number) {
  currentScene = index;  
  let s = scenes[index];
  enemiesClear()
  tilemapsClear();
  dialogClear();
  instructionsSnapshot();
  guitarClearRequests();
  guy.actv = false;
  
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


function guitarSong() {
  guitarClearRequests();
  jangleTime = 0;
  repeat(10, () => {
    guitarJangle(chordG, 2);
    guitarJangle(chordAm, 2);
    guitarJangle(chordF, 2);
    guitarJangle(chordGm, 2);
  })
}


const scenes: Scene[] = [
  { // 0
    setup: (s) => {
      sceneFlags.loading = false;
    },
    tick: () => {
      let msg = "INSERT CARTRIDGE\nPRESS SPACE";
      if (sceneFlags.loading) {
        msg += "\nLOADING";
        repeat(sceneTime* 7, () => msg += '.');
        if (sceneTime > 3) {
          sceneComplete();
        }
      }
      msg += (sceneTime % 0.25) > 0.1 ? "*" : "";
      printText(3, 3, msg);
      if (justPressed[Keys.Attack] && !sceneFlags.loading) {
        sceneFlags.loading = true;
        sceneTime = 0;
      }
    },
    nextScene: 1,
    title: true
  },

  { // 1
    setup: (s) => {
      spawnGuy(0, 0);
      guitarSong();
    },
    tick: () => {  
      if (sceneTime > 3) {
        instructionsShow([EventTypes.Start]);
      }

      printText(3, 3, "ROBIN\nOF\nTHIRTEENSLEY");
      if (justPressed[Keys.Attack]) {
        reportEvent(EventTypes.Start);
        sceneComplete();
      }
    },
    nextScene: 3,
    title: true
  },

  { // 2
    setup: () => {
      spawnGuy(0, 0);
      guitarSong();
      guyCelebrate(0, 0);
      makeDialog(`|TO BE CONTINUETH!
|THANK THEE FOR PLAYING THIS DEMO!
|LOOK FOR THE FULL ADVENTURE AT GREAT STORES LIKE BYTE SHOP, IN THE FALL OF '83|2`)
    },
    tick: () => {
      if (sceneTime > 30 || justPressed[Keys.Attack]) {
        dialogClear();
        sceneComplete();
      }
    },
    nextScene: 1,
    title: true
  },


  { // 3
    setup: () => {
      makeLevel1();
      //playSong(songJangle);
      makeDialog(`1|HAH, YOU THINK YOU CAN JOIN OUR BAND?!
1|PROVE IT. COLLECT ALL THE COIN`);
    },
    tick: () => {
      instructionsShow([EventTypes.Move, EventTypes.Jump]);
      if (coinCounter >= coinsTotal) {
        instructionsShow([EventTypes.Exit]);        
      }
    },
    endd: () => {
      makeDialog(`1|A MONKEY COULD HAVE DONE THAT...`);
    },
    nextScene: 4
  },

  { // 4
    setup: () => {
      makeLevel2();
      makeDialog(`1|OK, COINS DON'T JUST GROW ON TREES
1|SKEWER THESE TRAINING DUMMIES`);
    },
    tick: () => {
      instructionsShow([EventTypes.GuyGarde, EventTypes.Lunge]);
    },
    endd: () => {
      makeDialog(`1|WELL MAYBE YOU'RE NOT HOPELESS...`);
    },
    nextScene: 5
  },

  { // 5
    setup: () => {
      makeLevel3();
      makeDialog(`1|LET'S TRY A REAL FIGHT
1|WILL, GET OVER HERE!`);
    },
    tick: () => {
      instructionsShow([EventTypes.Parry, EventTypes.Feint]);
    },
    endd: () => {
      makeDialog(`1|THAT WAS PRETTY...
2|JOHN, JOHN!
2|THERE'S A CARRIAGE COMING!
1|HO BOY! EVERYONE TO THE AMBUSH
1|YOU TOO, ROBIN`);
    },
    nextScene: 6
  },


  { // 6
    setup: () => {
      makeLevel4();
      makeDialog(`1|MAKE YOUR WAY CAREFULLY
1|STAY AWAY FROM THE WILDLIFE
1|OH, AND THE TRAPS. WE HAVE BOOBY TRAPS`);
    },
    tick: () => {
      instructionsShow([EventTypes.DoubleJump]);
    },
    endd: () => {
      makeDialog(`1|EVERYONE HERE? SHHH THEY'RE COMING`);
    },
    nextScene: 7
  },


  { // 7
    setup: () => {
      makeLevel5();
      makeDialog(`1|IT'S A REVERSE AMBUSH!
1|ROBIN TAKE CARE OF THE SHERRIF'S MEN!`);
    },
    tick: () => {
    },
    endd: () => {
      makeDialog(`3|HELP HELP!
2|IS THAT... THE MAID MARION?
1|ROBIN, STOP THAT CARRIAGE!`);
    },
    nextScene: 2
  },

]

let scene: Scene;
startScene(7);
