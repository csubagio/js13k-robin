import fs from 'fs'
import * as terser from 'terser';
import { TimeStamper, WatchOnce } from './watch-once';


const watcher = new WatchOnce(build);


async function build() {
  let report = new TimeStamper('guitar builder');
  
  let source = fs.readFileSync(watcher.watch('guitar-worklet.js'), 'utf-8');
 
  let minified = await terser.minify(source, {
    toplevel:true, 
    compress: {
      arrows: true,
      unsafe_arrows: true,
      unsafe_methods: true,
      passes: 2,
      reduce_vars: true,
      reduce_funcs: true,
      drop_console: false,
      ecma: 2015
    },
    mangle:{
      toplevel:true, 
      properties: {
        reserved: ['t']
      }
    }
  });
  
  if (!minified.code) {
    throw new Error('minifier failed');
  }

  fs.writeFileSync('guitar-worklet-minified.js', minified.code);

  let html = fs.readFileSync( watcher.watch('guitar-worker-source.html'), 'utf-8');
  html = html.replace('/*WORKER*/', minified.code);
  
  fs.writeFileSync('guitar-worker.html', html);
  console.log(`  minified: ${minified.code.length}`);
  report.end();
}

build()


fs.watchFile('./guitar-worklet.js', build);
fs.watchFile('./guitar-worker-source.html', build);
