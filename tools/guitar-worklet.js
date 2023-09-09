var guitarSampleRate = 44000;

class G extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.strings = options.processorOptions.t.map(frequency => {
      var len = 0|guitarSampleRate / frequency;
      var s = {
        array: new Float32Array(len),
        first: 0,
        last: 0,
        baseFrequency: frequency,
        len: len,
        tick: 0
      };
      s.array.fill(0);
      return s;
    });

    this.port.onmessage = (msg)  => {
      var [strings, intensity] = msg.data;
      strings.map((fret, i) => {
        if (+fret === fret) {
          var string = this.strings[i];
          var len = 0 | guitarSampleRate / (string.baseFrequency * Math.pow(1.059, fret));
          string.first = 0;
          string.last = len;
          string.tick = 0;
          var a = string.array;
          a.map((v, i) => { a[i] = (intensity || 1) * (Math.random() * 2 - 1) });
        }
      })
    }
  }

  process(inputs, outputs, parameters) {
    let channel = outputs[0][0];
    channel.map((v, i) => {
      channel[i] = 0;
      this.strings.map(function (string) {
        var avg = string.array[string.first];
        string.first = ++string.first % string.len;
        avg = (avg + string.array[string.first]) / 2 * .995;
        string.last = ++string.last % string.len;
        string.array[string.last] = avg;
        string.tick ++;
        channel[i] += avg * Math.min(1, string.tick/500);
      });
    })
    return true;
  }
}

registerProcessor('G', G);


