const cameraTarget: [number, number] = [0, 0];
const cameraIntermediate: [number, number] = [0, 0];
const camera: [number, number] = [0, 0];

function resetTransform() {
  ctx.resetTransform();
}

function cameraSetTarget(x: number, y: number) {
  cameraTarget[0] = x;
  cameraTarget[1] = y;
}

function cameraCutTo(x: number, y: number) {
  cameraIntermediate[0] = cameraTarget[0] = x;
  cameraIntermediate[1] = cameraTarget[1] = y;
}

function cameraUpdate() {
  cameraIntermediate[0] += (cameraTarget[0] - cameraIntermediate[0]) * ( 1 - pow(0.001, ds) );
  cameraIntermediate[1] += (cameraTarget[1] - cameraIntermediate[1]) * (1 - pow(0.01, ds));
  
  camera[0] = round(cameraIntermediate[0]) - screenWidth / 2;
  camera[1] = -round(cameraIntermediate[1]) + screenHeight / 2;
}

function applyCamera() {
  resetTransform();
  ctx.translate(-camera[0], 80 - camera[1]);
}

function applyCameraPos(x: number, y: number) {
  applyCamera();
  ctx.translate(round(x), round(-y));
}

function applyCameraParallax(x: number, y: number) {
  resetTransform();
  ctx.translate(round(-camera[0] * x), round(80 - camera[1] * y));
}

function flipHorizontal() {
  ctx.scale(-1, 1);
}

