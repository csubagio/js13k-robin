

let mainCanvas = document.getElementById('c') as HTMLCanvasElement;
let screenWidth = 128;
let screenHeight = 80;
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
let ctx = get2DContext(mainCanvas);
ctx.imageSmoothingEnabled = false;

//mainCanvas.style.maxWidth = `${screenWidth*4}px`;

let last = 0;

let titleWidth = [0,0,0,0,0];

let hudTick = noop;

function tick(clock: number) {
  resetTransform();
  fillStyl('#21181b');
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  let dt = min( 100, clock - last );
  if ( last === 0 ) { dt = 0 }
  last = clock;
  ds = dt / 1000.0;
  //ds = 0.004;
  clck += ds;

  tickGuy(guy);
  enemiesTick();

  cameraUpdate();

  tilemapDraw();
  enemiesDraw();
  guyDraw(guy);

  ctx.resetTransform();

  if (dialogTick()) {

  } else {
    if (coinsTotal) {
      drawAnim(coinAnim, 0, 107 - 21, 73 - 18);
      printText( 107, 72, `${coinCounter}/${coinsTotal}`);
    }
  }

  if ( !scene.title )
  {
    let health = "";
    //console.log(guy.health);
    repeat(3, (i) => health += (i < guy.health ? '$' : '%'));
    printText(56, 4, health);
  }

  sceneTick();

  justPressed = [];

  hudTick();

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mainCanvas);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  guitarBeater();

  requestAnimationFrame(tick);
}


mainCanvas.style.display = 'none';
let canvas3d = document.createElement('canvas');
document.body.appendChild(canvas3d);
canvas3d.width = screenWidth * 8;
canvas3d.height = screenHeight * 8;
let gl = canvas3d.getContext("webgl2");
{
  let vertices = [
    -1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ];
  let vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  let vertCode = `
attribute vec2 c;
varying vec2 u;
void main(void) {
u=c*0.5+0.5;
u.y=1.0-u.y;
gl_Position=vec4(c,0.5,1.0);
}`
  let vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);
  let fragCode = `
precision highp float;
varying vec2 u;
uniform sampler2D t;
void main(void) {
vec2 a=u;
a.x+=sin(u.x*6.28)*0.01;
a.y+=sin(u.y*6.28)*0.01;
vec4 c=texture2D(t,a);
c.r=texture2D(t,a+vec2(0.004,0.0)).r;
c.b=texture2D(t,a-vec2(0.004,0.0)).b;
vec2 d=abs(2.0*u-1.0);
float v=1.0-pow(d.x,20.0)-pow(d.y,20.0);
float l=1.0-pow(d.x,4.0)-pow(d.y,4.0);
c*=(0.5+0.6*l)*step(0.0,v)*(0.6+0.5*abs(sin(a.y*3.14*${screenHeight}.0)));
c.a = 0.8;
gl_FragColor=c;
}`
  let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);
  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //gl.viewport(0,0,canvas3d.width,canvas3d.height);
}




tick(0);
