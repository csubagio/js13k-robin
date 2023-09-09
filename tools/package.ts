import * as terser from 'terser';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { WatchOnce, TimeStamper } from './watch-once';


let watcher = new WatchOnce(() => packageBuild());

export async function packageBuild() {
  const stamp = new TimeStamper(`packager`);

  let filename = path.join(__dirname, '..', 'game.js');
  watcher.watch(filename);
  let source = fs.readFileSync(filename, 'utf-8');

  filename = path.join(__dirname, '..', 'source.html');
  watcher.watch(filename);
  let html = fs.readFileSync('../source.html', 'utf8');

  source = source.replace(/\/\/DEBUG([\s\S]*)ENDDEBUG/g, '');

  let minified = await terser.minify(source, {
    toplevel:true, 
    compress: {
      arrows: true,
      unsafe_arrows: true,
      unsafe_methods: true,
      passes: 2,
      reduce_vars: true,
      reduce_funcs: true,
      drop_console: true,
      ecma: 2020
    },
    mangle:{
      toplevel:true, 
      properties: true
    }});

  if ( minified.code ) {
    let game = html.replace(`<script src="game.js"></script>`, `<script>${minified.code}</script>`);

    console.log(`  package size: ${game.length / 1024}kb`);

    let outFile = path.join(__dirname, '..', 'game.html');
    let zipFile = path.join(__dirname, '..', 'game.zip');
    fs.writeFileSync(outFile, game);

    let zip = new JSZip;
    zip.file('game.html', game);
    zip.generateAsync({
      type : "uint8array",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    }).then( (data) => {
      console.log(`  zip size: ${data.length / 1024}kb`);
      fs.writeFileSync(zipFile, data);
      stamp.end();
    })
  }
} 

packageBuild();
