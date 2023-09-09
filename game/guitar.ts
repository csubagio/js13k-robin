
interface GuitarString {
  array: Float32Array,
  first: number,
  last: number,
  baseFrequency: number,
  len: number,
}

interface Guitar {
  node: AudioNode, strings: GuitarString[]
}

let guitarSampleRate = 44000;

function makeGuitar(ctx: AudioContext, tuning: number[]): Guitar {
  const node = ctx.createScriptProcessor(2048, 1, 1);

  // need to have something that ticks itself in the graph, otherwise script processor doesn't run!
  const oo = ctx.createOscillator();
  oo.connect(node);
  oo.start();

  // create all strings at their open frequencies
  const strings: GuitarString[] = tuning.map(frequency => {
    let len = Math.round(guitarSampleRate / frequency);
    let s: GuitarString = {
      array: new Float32Array(len),
      first: 0,
      last: 0,
      baseFrequency: frequency,
      len
    }
    s.array.fill(0);
    return s;
  });

  const tick = (string: GuitarString) => {
    let avg = string.array[string.first];
    string.first = (++string.first) % string.len;
    avg = (avg + string.array[string.first]) / 2 * .995;
    string.last = (++string.last) % string.len;
    string.array[string.last] = avg;
    return avg;
  }
  
  node.onaudioprocess = (e) => {
    let b = e.outputBuffer.getChannelData(0);
    b.forEach((v, i) => {
      b[i] = 0;
      strings.forEach(s => {
        b[i] += tick(s);
      })
    })
  };
  node.connect(ctx.destination);
  return { node, strings }
} 

let guitar: Guitar | undefined = undefined;

const guitarNaturalTuning = [82, 110, 147, 196, 247, 330];

function guitarPluck(string: number, fret: number, intensity: number = 1) {
  let s = guitar.strings[string];
  let f = Math.round(guitarSampleRate / (s.baseFrequency * Math.pow(1.059, fret)));
  s.first = 0;
  s.last = f;
  let a = s.array;
  a.forEach((v, i) => a[i] = i < f ? (intensity * random() * 2 - 1) : 0 );
}






interface GuitarStep {
  s: number[]; // strings
  b?: number; // how many beats to skip until the next
  i?: number; // intensity
}

interface GuitarSong {
  patterns: GuitarStep[][];
  song: number[];
  bpm: number;
  wait: number;
  step: number;
  patternStep: number;
  playing: boolean;
  loop: boolean;
}

function makeGuitarSong(patterns: GuitarStep[][], song: number[], bpm: number = 120, loop: boolean): GuitarSong {
  return { patterns, song, bpm, loop, wait: 0, step: 0, patternStep: 0, playing: true }
}

function guitarSongTick(gs: GuitarSong, deltaSeconds: number) {
  if (!gs || !gs.playing) return;
  gs.wait -= deltaSeconds;
  if (gs.wait < 0) {
    let pattern = gs.patterns[gs.song[gs.patternStep]];
    if (!pattern) return;
    let step = pattern[gs.step];
    let delay = random() * 20;
    step.s.forEach((fret, stringIndex) => {
      if (fret === undefined) return;
      setTimeout(() => guitarPluck(stringIndex, fret, step.i), delay);
      delay += 25;
    })
    gs.wait += (step.b || 1) * 60 / gs.bpm;
    ++gs.step;
    if (gs.step >= pattern.length) { 
      gs.step = 0;
      ++gs.patternStep;
      if (gs.patternStep >= gs.song.length && gs.loop) {
        gs.patternStep = 0;
      }
    }
  }
}


type GuitarSongArguments = [GuitarStep[][], number[], number, boolean];

function guitarPickNotes(n: string): GuitarStep[] {
  let res: GuitarStep[] = [];
  let step: GuitarStep;
  let note = 'C';
  let octave = 2;
  let duration = 1;
  const fretMap = {
    'E0': [0],
    'F0': [1],
    'G0': [3],
    'A1': [5],
    'B1': [7],
    'C1': [,3],
    'D1': [,5],
    'E1': [,7],
    'F1': [,8],
    'G1': [,,5],
    'A2': [,,7],
    'B2': [,,,4],
    'C2': [,,,5],
    'D2': [,,,7],
    'E2': [,,,,5],
    'F2': [,,,,6],
    'G2': [,,,,8],
    'A3': [,,,,,5],
    'B3': [,,,,,7],
    'C3': [,,,,,8],
    'D3': [,,,,,10],
    'E3': [,,,,,12],
  }

  const flatMap = Object.assign({}, fretMap);
  Object.keys(flatMap).forEach(k => {
    flatMap[k].forEach((v, i) => { if (v) { flatMap[k][i] = v - 1 } });
  })

  let map = fretMap;
  for (let i = 0; i < n.length; ++i) {
    let c = n[i];
    if (c >= 'A' && c <= 'G') {
      note = c;
      if ( !fretMap[note+octave] ) { throw(`bad note: ${note+octave}`) }
      step = { s: fretMap[note+octave], b: duration };
      res.push(step);
    }
    if (c === '0') {
      step = { s: [], b: duration };
      res.push(step);
    }
    if (c >= 'a' && c <= 'g') {
      octave = c.charCodeAt(0) - 97;
    }
    if (c >= '1' && c <= '9') {
      duration = c.charCodeAt(0) - 48;
    }
    if (c === '&') {
      map = flatMap;
    }
    if (c === '%') {
      map = fretMap;
    }
  }
  return res;
}











const songJangle: GuitarSongArguments = [
  [
    [ // 0
      { s: [,,3] },
      { s: [,,,3,3] },
      { s: [,1] },
      { s: [,,,3,3] },
    ],
    [ // 1
      { s: [,,3] },
      { s: [,,,3,4] },
      { s: [,1] },
      { s: [,,,3,3] },
    ],
    [ // 2
      { s: [,0] },
      { s: [,,,2,2] },
      { s: [,1] },
      { s: [,,,3,3] },
    ],
    [ // 3
      { s: [,1] },
      { s: [,,,3,3] },
    ],
    [ // 4
      { s: [,,3] },
      { s: [,,,3,4] },
      { s: [,3] },
      { s: [,,,3,4] },
    ],
    [ // 5
      { s: [,3] },
      { s: [,,5,5] },
      { s: [5] },
      { s: [,,5,5] },
    ],
    [ // 6
      { s: [1] },
    ],
    [ // 7
      { s: [1,3,3,2,1] },
    ],
    [
      // 8
      { s: [], b: 2 }
    ]
  ], 
  [
    0, 0, 0,
    //0, 1, 0, 2,
    //0, 3,
    0, 1, 0, 2,
    //0, 0, 
    0, 4, 
    5, 5, 6, 7, 7, 7, 7, 8
  ],
  140,
  true
];



const songEnd: GuitarSongArguments = [
  [
    [ 
      { s: [1, 3, 3, 2, 1, 1] },
    ],
    guitarPickNotes(`1FD&B%D CAbFcA &A%AbGG2F40`)
  ],
  [
    0,1
  ],
  200,
  false
]


function playSong(params: GuitarSongArguments) {
  if (!guitar) {
    guitar = makeGuitar(zzfxX, guitarNaturalTuning);
  }
  

  /*
  const lead: GuitarSongArguments = [
    [
      guitarPickNotes(`bFFFcAAC2C 1DDD&B%2CA 1bFFFF FGcAbF GGGG2cA4A40
        1bFFFcA ACCA DDD&B%2CA 1bFFFF cAAAbF GGGE 4F 40
        1c&EEEE EEEE EEEE% F&E%DC DDDD &D%DE 40
        1FFFF FFFF  FFFF GFED  EEEE EDCA  4CC
        1FD&B%D CAbFcA &A%AbGG2F40`)
      ],
    [
      0
    ],
    400
  ]
  */

  /*
  const lead: GuitarSongArguments = [
    [
      guitarPickNotes(`
        c 2F1F2F1F d 2A1A 2A1cF d2D1D 2D 1&B 2C 4A
        c 2F1F2F1F d 2A1A 2A1cF d2B1B 2D 1&B 2C 4A`)
      ],
    [
      0
    ],
    400
  ]
  */

  /*
  const chords: GuitarSongArguments = [
    [
      [ { s: [, , 3, 2, 1, 1], b: 4 } ]
    ],
    [0, 0, 0, 0],
    200
  ]
  */

  guitarSong1 = makeGuitarSong.apply(null, params);
  //guitarSong2 = makeGuitarSong.apply(null, lead);
}

let guitarSong1: GuitarSong | undefined = undefined;
let guitarSong2: GuitarSong | undefined = undefined;
