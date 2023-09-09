
/*
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
    let len = round(guitarSampleRate / frequency);
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
  zzfxX.resume();
  let s = guitar.strings[string];
  let f = round(guitarSampleRate / (s.baseFrequency * pow(1.059, fret)));
  s.first = 0;
  s.last = f;
  let a = s.array;
  a.forEach((v, i) => a[i] = i < f ? intensity * (random() * 2 - 1) : 0 );
}
*/


const audioContext = new AudioContext();

let guitarNaturalTuning = [82, 110, 147, 196, 247, 330, 1000];
let workletCode = `data:text/javascript,class r extends AudioWorkletProcessor{constructor(r){super(),this.o=r.processorOptions.t.map((r=>{var s=0|44e3/r,e={i:new Float32Array(s),h:0,u:0,l:r,v:s,M:0};return e.i.fill(0),e})),this.port.onmessage=r=>{var[s,e]=r.data;s.map(((r,s)=>{if(+r===r){var t=this.o[s],a=0|44e3/(t.l*Math.pow(1.059,r));t.h=0,t.u=a,t.M=0;var o=t.i;o.map(((r,s)=>{o[s]=(e||1)*(2*Math.random()-1)}))}}))}}process(r,s,e){return s[0].map((r=>{r.map(((s,e)=>{r[e]=0,this.o.map((s=>{var t=s.i[s.h];s.h=++s.h%s.v,t=(t+s.i[s.h])/2*.995,s.u=++s.u%s.v,s.i[s.u]=t,s.M++,r[e]+=t*Math.min(1,s.M/500)}))}))})),!0}}registerProcessor("G",r)`;
        
let guitar;
async function startGuitar() {
  await audioContext.audioWorklet.addModule(workletCode);
  guitar = new AudioWorkletNode(audioContext, "G", 
    { processorOptions: { t: guitarNaturalTuning } }
  );
  guitar.connect(audioContext.destination);
}

function guitarPluck(strings: number[], intensity: number) {
  audioContext.resume();
  guitar.port.postMessage([strings, intensity]);
}

startGuitar();






