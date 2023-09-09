
var guitarSampleRate = 44000;
function makeGuitar(ctx, tuning) {
    var node = ctx.createScriptProcessor(2048, 1, 1);
    // need to have something that ticks itself in the graph, otherwise script processor doesn't run!
    var oo = ctx.createOscillator();
    oo.connect(node);
    oo.start();
    // create all strings at their open frequencies
    var string = function (frequency) {
        var len = Math.round(guitarSampleRate / frequency);
        var s = {
            array: new Float32Array(len),
            first: 0,
            last: 0,
            baseFrequency: frequency,
            len: len
        };
        s.array.fill(0);
        strings.push(s);
    };
    var strings = [];
    tuning.forEach(function (f) { return string(f); });
    var tick = function (string) {
        var avg = string.array[string.first];
        string.first = (++string.first) % string.len;
        avg = (avg + string.array[string.first]) / 2 * .995;
        string.last = (++string.last) % string.len;
        string.array[string.last] = avg;
        return avg;
    };
    node.onaudioprocess = function (e) {
        var b = e.outputBuffer.getChannelData(0);
        b.forEach(function (v, i) {
            b[i] = 0;
            strings.forEach(function (s) {
                b[i] += tick(s);
            });
        });
    };
    node.connect(ctx.destination);
    return { node: node, strings: strings };
}
var guitar = undefined;
var guitarNaturalTuning = [82, 110, 147, 196, 247, 330];
function guitarPluck(string, fret, intensity) {
    if (intensity === void 0) { intensity = 1; }
    var s = guitar.strings[string];
    var f = Math.round(guitarSampleRate / (s.baseFrequency * Math.pow(1.059, fret)));
    s.first = 0;
    s.last = f;
    var a = s.array;
    a.forEach(function (v, i) { return a[i] = i < f ? (intensity * Math.random() * 2 - 1) : 0; });
}
window.guitar = makeGuitar(new AudioContext, guitarNaturalTuning);
window.addEventListener('keydown', (ev) => {
  let k = (ev.keyCode - 49);
  guitarPluck(k, 0);
})
