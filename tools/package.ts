import * as terser from 'terser';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { WatchOnce, TimeStamper } from './watch-once';
import * as roller from 'roadroller';

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
        properties: {
          keep_quoted: true
        }
      }
    });
  } catch (err) {
    console.error('failed to compile');
    return;
  }

  if (minified.code) {
    minified.code = minified.code.replace(/const /g, 'let ');
    let finalCode = minified.code;


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


    {
      const inputs: roller.Input[] = [
        {
            data: minified.code,
            type: roller.InputType.JS,
            action: roller.InputAction.Eval,
        },
      ];
      
      const options = {
          // see the Usage for available options.
      };
      
      const packer = new roller.Packer(inputs, options);
      await packer.optimize(); // takes less than 10 seconds by default
      
      const { firstLine, secondLine } = packer.makeDecoder();
      finalCode = firstLine + secondLine;
    }


    const scriptSite = `<script src="../game.js"></script>`;
    let htmlParts = html.split(scriptSite);
    let game = htmlParts[0] + `<script>${finalCode}</script>` + htmlParts[1];

    console.log(`  package size: ${game.length / 1024}kb`);


    let miniFile = path.join(__dirname, '..', 'minified.js');
    let outFile = path.join(__dirname, '..', 'index.html');
    let zipFile = path.join(__dirname, '..', 'game.zip');
    fs.writeFileSync(miniFile, minified.code);
    fs.writeFileSync(outFile, game);

    let zip = new JSZip;
    zip.file('index.html', game);
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
