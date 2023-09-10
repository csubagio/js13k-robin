const enum EventTypes {
  Start,
  Move,
  Jump,
  Exit,
  GuyGarde,
  Lunge,
  Parry,
  Feint,
  PickupCoin,
  DefeatEnemy
}

const instructions = [
  "PRESS SPACE TO START",
  "PRESS <> TO MOVE",
  "PRESS ^ TO JUMP",
  "EXIT AT THE GATE",
  "APPROACH TO ENGAGE",
  "PRESS SPACE TO LUNGE",
  "WHEN ATTACKED, PRESS UP TO PARRY",
  "PRESS DOWN TO FEINT",
];

let instructionsCapture: boolean[] = [];
let instructionsComplete: boolean[] = [];
let showingInstruction: EventTypes | -1 = -1;

function reportEvent(event: EventTypes) {
  instructionsComplete[event] = true;
  if (showingInstruction === event) {
    dialogClear();
  }
}

function instructionsSnapshot() {
  instructionsCapture = instructionsComplete.slice(0); 
}

function instructionsRestore() {
  instructionsComplete = instructionsCapture.slice(0);
}

function instructionsShow(need: EventTypes[]) {
  if (dialogIsComplete()) {
    need.map(i => {
      if (showingInstruction === -1 && !instructionsComplete[i]) {
        makeDialog(`|${instructions[i]}|2`);
        showingInstruction = i;
      }
    })
  }
}
