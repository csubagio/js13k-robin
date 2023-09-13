

const audioContext = new AudioContext();

let guitarNaturalTuning = [82, 110, 147, 196, 247, 330, 1000];
let workletCode = `data:text/javascript,class r extends AudioWorkletProcessor{constructor(r){super(),this.o=r.processorOptions.t.map((r=>{let s=0|44e3/r,e={i:new Float32Array(s),h:0,u:0,l:r,v:s,M:0};return e.i.fill(0),e})),this.port.onmessage=r=>{let[s,e]=r.data;s.map(((r,s)=>{if(+r===r){let t=this.o[s],a=0|44e3/(t.l*Math.pow(1.059,r));t.h=0,t.u=a,t.M=0;let o=t.i;o.map(((r,s)=>{o[s]=(e||1)*(2*Math.random()-1)}))}}))}}process(r,s,e){return s[0].map((r=>{r.map(((s,e)=>{r[e]=0,this.o.map((s=>{let t=s.i[s.h];s.h=++s.h%s.v,t=(t+s.i[s.h])/2*.997,s.u=++s.u%s.v,s.i[s.u]=t,s.M++,r[e]+=t*Math.min(1,s.M/500)}))}))})),!0}}registerProcessor("G",r)`;
        


type Guitar = AudioWorkletNode;

async function startGuitar(): Promise<AudioWorkletNode> {
  await audioContext.audioWorklet.addModule(workletCode);
  let guitar = new AudioWorkletNode(audioContext, "G", 
    { processorOptions: { t: guitarNaturalTuning } }
  );
  guitar.connect(audioContext.destination);
  return guitar;
}



type GuitarRequest = [
  number /*beat*/,
  number /*guitar*/,
  number[] /*strings*/,
  number /*intensity*/,
  number[]?
];

let guitarRequests: GuitarRequest[] = [];

function guitarClearRequests() {
  guitarRequests = [];
}

function guitarPluck(guitar: number, strings: number[], intensity: number) {
  //audioContext.resume();
  guitarRequests.push( [guitarBeat + 1, guitar, strings, intensity] );
}

let guitars: Guitar[] = [];

(async () => {
  guitars[0] = await startGuitar();
  guitars[1] = await startGuitar();
})()

let chordG = [3, 2, 0, 0, 0, 3];
let chordF = [1, 3, 3, 2, 1, 1];
let chordBm = [, 1, 3, 3, 2, 1];
let chordGm = [1, 3, 3, 1, 1, 1];
let chordEm7 = [0, 2, 0, 0, 0, 0];
let chordAm = [0, 0, 2, 2, 1, 0];

let activeChord = chordG;

function strumSingle(chord: number[], string: number) {
  let strum = [];
  strum[string] = chord[string];
  return strum;
}

function strumSeveral(chord: number[], strings: number[]) {
  let strum = [];
  strings.map((n, string) => n ? strum[string] = chord[string] : 0);
  return strum;
}

function guitarSingleString(guitar: number, strings: number[], intensity: number = 0.5) {
  let string = pick(strings);
  guitarPluck(guitar, strumSingle(activeChord, string), intensity);
}

function guitarTwoStrings(guitar: number, intensity = 0.5) {
  let strings = pick([[0, 4], [1, 3], [2, 4]]);
  let strum = [];
  strings.map(s => strum[s] = activeChord[s]);
  guitarPluck(guitar, strum, intensity);
}

function guitarRaiseChord(guitar: number, chord: number[]) {
  let b = guitarBeat;
  repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, i), 1]); b += 4 });
}

function guitarArp(guitar: number, chord: number[]) {
  let b = guitarBeat;
  repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, 5-i), 1]); b += 4 });
  repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, i), 1]); b += 2 });
}

function guitarSchedule(chord: number[], strum: number[], delay: number, intensity: number) {
  guitarRequests.push([guitarBeat + delay, 1, strum, intensity, chord]);
}

let jangleTime = 0;

function guitarJangle(chord: number[], repeats: number) {
  repeat(repeats, () => {
    guitarSchedule(chord, strumSingle(chord, 0), jangleTime, 0.2);
    jangleTime += 7
    guitarSchedule(chord, strumSeveral(chord, [, , 1,]), jangleTime, 0.2);
    jangleTime ++
    guitarSchedule(chord, strumSeveral(chord, [, , , 1, 1, 1]), jangleTime, 0.2);
    jangleTime += 8
    guitarSchedule(chord, strumSingle(chord, 1), jangleTime, 0.2);
    jangleTime += 7
    guitarSchedule(chord, strumSeveral(chord, [, , 1,]), jangleTime, 0.2);
    jangleTime ++
    guitarSchedule(chord, strumSeveral(chord, [, , , 1, 1, 1]), jangleTime, 0.2);
    jangleTime += 8
  })
}

let guitarPeriod = 0.05;
let guitarBeat = 0;
let guitarTime = 0;
function guitarBeater() {
  guitarTime -= ds;
  if (guitarTime < 0) {
    guitarTime += guitarPeriod;
    guitarBeat++;
    guitarRequests = guitarRequests.filter(g => {
      if (g[0] > guitarBeat) return true
      //console.log(g[2])
      guitars[g[1]].port.postMessage([g[2], min(0.1, 0.1 * g[3])])
      if (g[4]) {
        activeChord = g[4];
      }
      return false;
    })
  }
}

