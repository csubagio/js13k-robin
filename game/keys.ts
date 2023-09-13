
const enum Keys {
  Up = 38,
  Down = 40, 
  Left = 37, 
  Right = 39,
  Attack = 32,
  Dialog = 90
}

const KeyAliases: Record<number, Keys> = {
  87: Keys.Up,   // w
  65: Keys.Left, // a
  83: Keys.Down, // s
  68: Keys.Right,// d
}

let pressed: boolean[] = [];
let justPressed: boolean[] = [];

window.addEventListener('keydown', (ev) => {
  audioContext.resume();
  let code = ev.keyCode;
  if (!pressed[code]) {
    pressed[code] = true;
    justPressed[code] = true;
    code = KeyAliases[code];
    pressed[code] = true;
    justPressed[code] = true;
  }
});

window.addEventListener('keyup', (ev) => {
  let code = ev.keyCode;
  pressed[code] = false;
  code = KeyAliases[code];
  pressed[code] = false;
});
