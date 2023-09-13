const enum DialogCondition {
  Timeout,
  Press,
  Hold
}

interface DialogLine {
  who: number;
  says: string;
  condition: DialogCondition;
}

interface DialogScript {
  lines: DialogLine[]
}

function makeDialog(input: string) {
  let lines: DialogLine[] = input.split('\n').map(line => {
    let parts = line.split('|');
    return { who: 1 * (parts[0] as any as number), says: parts[1], condition: 1 * (parts[2] as any as number) || DialogCondition.Timeout };
  })
  dialog = { lines }
  dialogLine = -1;
  dialogNext();
}

function dialogClear() {
  dialog = 0;
  showingInstruction = -1;
}

let dialog: DialogScript | 0 = 0;
let dialogLine = 0;
let dialogTime = 0;
let dialogWait = 2;
let dialogShowingAll = false;

const dialogNext = () => {
  dialogLine++;
  dialogTime = 0;
  dialogWait = 2;
  dialogShowingAll = false;
}

function dialogIsComplete() {
  return dialog === 0 || dialogLine >= dialog.lines.length;
}

function dialogTick() {
  if (dialog === 0) return false;

  let dline = dialog.lines[dialogLine];
  if (!dline) return false;

  dialogTime += ds;
  if (dialogShowingAll) {
    dialogWait -= ds;
  }

  if (dline.condition === DialogCondition.Press) {
    if (justPressed[Keys.Dialog]) {
      return dialogNext();
    }
  }
  if (dline.condition === DialogCondition.Timeout) {
    if (dialogWait < 0) {
      return dialogNext();
    }
  }

  let maxLetters = 22;
  let textX = 3;
  if (dline.who > 0) {
    ctx.resetTransform();
    fillStyl(cssPalette[0]);
    globalAlph(0.5);
    ctx.fillRect(0, 80 - 28, 22, 28);
    globalAlph(1);
    drawAnim(portraitAnim, (dline.who-1) * 2 + (dialogShowingAll ? 0 : round(dialogTime * 8) % 2), 1, 80 - 27);
    maxLetters = 20;
    textX = 22;
  }

  let words = dline.says.split(' ');
  let line: string = '';
  let lines: string[] = [];
  while (words.length) {
    if (line.length + words[0].length > maxLetters) {
      lines.push(line);
      line = '';
    }
    line += ' ' + words.shift();
  }
  lines.push(line);

  let y = 80 - lines.length * 8 - 1;
  let remaining = dialogTime * 20;

  lines.map(l => {
    let showing = min(remaining, l.length);
    globalAlph(0.5);
    ctx.fillRect(textX, y - 1, 100, 8);
    globalAlph(1);
    let txt = l.substring(0, showing);
    let wid = printText(0, 0, txt, true);
    printText(textX + floor((screenWidth - 4 - textX - wid) / 2), y, txt);
    remaining -= showing;
    y += 8;
  })
  dialogShowingAll = remaining > 0;

  return true;
}

