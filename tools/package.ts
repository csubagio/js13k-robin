import * as terser from 'terser';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { WatchOnce, TimeStamper } from './watch-once';


let watcher = new WatchOnce(() => packageBuild());

export async function packageBuild() {
  const stamp = new TimeStamper(`packager`);

  const jsBuiltFile = path.join(__dirname, '..', 'game.js');
  watcher.watch(jsBuiltFile);
  let source = fs.readFileSync(jsBuiltFile, 'utf-8');

  const htmlSourceFile = path.join(__dirname, '..', 'game', 'source.html');
  watcher.watch(htmlSourceFile);
  let html = fs.readFileSync(htmlSourceFile, 'utf8');

  source = source.replace(/\/\/DEBUG([\s\S]*)ENDDEBUG/g, '');

  let minified;
  try {
    minified = await terser.minify(source, {
      toplevel: true,
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
      mangle: {
        toplevel: true,
        properties: true
      }
    });
  } catch (err) {
    console.error('failed to compile');
    return;
  }

  if (minified.code) {
    minified.code = minified.code.replace(/const/g, 'let');

    const scriptSite = `<script src="../game.js"></script>`;
    let htmlParts = html.split(scriptSite);
    let game = htmlParts[0] + `<script>${minified.code}</script>` + htmlParts[1];

    console.log(`  package size: ${game.length / 1024}kb`);

    let keywordsFile = path.join(__dirname, '..', 'keywords.txt');
    let uniqueWords: Record<string, number> = {};
    for (let w of (minified.code as string).matchAll(/\w\w\w+/g)) {
      if (w[0].length < 20) {
        uniqueWords[w[0]] = (uniqueWords[w[0]]|0) + 1;
      }
    }
    let keyWords: [number, string][] = Object.keys(uniqueWords).map(k => [uniqueWords[k], k]);
    keyWords.sort((a, b) => b[0] - a[0]);
    fs.writeFileSync(keywordsFile, keyWords.map(k => `${k[0]}: ${k[1]}`).join('\n'));

    let miniFile = path.join(__dirname, '..', 'minified.js');
    let outFile = path.join(__dirname, '..', 'game.html');
    let zipFile = path.join(__dirname, '..', 'game.zip');
    fs.writeFileSync(miniFile, minified.code);
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
