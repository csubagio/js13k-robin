import * as terser from 'terser';
import fs from 'fs';

let source = fs.readFileSync('./mini-test-source.js', 'utf8');
async function doit() {

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
      ecma: 2015
    },
    mangle:{
      toplevel:true, 
      properties:{
        
      }
    }
  });
  
  if (minified.code) {
    console.log(`${(minified.code.length / 1024).toFixed(2)}kb`);
    fs.writeFileSync('./mini-test-output.js', minified.code);
  } else {
    console.log(minified);
  }
}
  
doit();
