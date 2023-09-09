import fs from "fs";

export class TimeStamper {
  start = Date.now();

  constructor(public name: string) {
    timestamp(`>>> ${name} start`);
  }

  end() {
    let d = Date.now() - this.start;
    timestamp(`<<< ${this.name} end in ${(d/1000).toFixed(2)}ms`);
  }
}

export function timestamp(prefix: string) {
  let d = new Date;
  console.log(`${prefix} @ ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`);
}

export class WatchOnce {
  watchers: Record<string, true> = {};

  constructor(public callback: () => void) { }
  
  watch(filename: string) : string {
    if (this.watchers[filename] !== undefined) return filename;
    console.log(filename);
    this.watchers[filename] = true;
    fs.watchFile(filename, () => this.callback());
    return filename;
  }
}
