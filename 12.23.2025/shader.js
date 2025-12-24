let myShader;

function preload() {
  myShader = loadShader('vshader.vert', 'fshader.frag');
}

function setup() {
  // Use WEBGL renderer for shaders
  dimx = min(windowHeight-200, windowWidth-200);
  dimy = dimx;
  createCanvas(dimx,dimy,WEBGL);
  pixelDensity(1);
}

function draw() {
  shader(myShader);

  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_mouse', [mouseX, height - mouseY]); 
  myShader.setUniform('u_time', millis() / 1000.0);

  rect(0, 0, width, height); // full-canvas quad
}

function windowResized() {
  dimx = min(windowHeight-200, windowWidth-200);
  dimy = dimx;
  resizeCanvas(dimx,dimy);
}