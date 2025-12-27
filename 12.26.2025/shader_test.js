let myShader;
let mic, fft;
let micReady = false;
let audioStarted = false;

let storedind = 0;
let xvec = [0, 0, 0, 0, 0];
let yvec = [0, 0, 0, 0, 0];
let rvals = [0, 0, 0, 0, 0];
let gvals = [0, 0, 0, 0, 0];
let bvals = [0, 0, 0, 0, 0];

let stored1 = [0, 0];
let stored2 = [0, 0];
let stored3 = [0, 0];
let stored4 = [0, 0];
let stored5 = [0, 0];
let col1 = [0, 0, 0];
let col2 = [0, 0, 0];
let col3 = [0, 0, 0];
let col4 = [0, 0, 0];
let col5 = [0, 0, 0];

// start with LOW thresholds so you can see stuff moving
let bassThresh   = 225.0;
let midsThresh   = 150.0;
let trebleThresh = 100.0;

let dimx, dimy;

function preload() {
  myShader = loadShader('vshader.vert', 'fshader.frag');
}

function setup() {
  dimx = min(windowHeight - 300, windowWidth - 300);
  dimy = dimx;
  createCanvas(dimx, dimy, WEBGL);
  pixelDensity(1);
  shader(myShader);

  // initial visible blobs so we know shader is alive
  for (let i = 0; i < 5; i++) {
    xvec[i] = (i + 1) * (width / 6);
    yvec[i] = height / 2;
  }
  rvals = [1.0, 0.8, 0.0, 0.0, 0.5];
  gvals = [0.2, 0.8, 0.5, 0.0, 0.0];
  bvals = [0.5, 0.0, 0.9, 1.0, 0.2];
}

function startMic() {
  mic = new p5.AudioIn();
  mic.start(
    () => {
      console.log("✅ Default mic started");
      fft = new p5.FFT(0.8, 1024);
      fft.setInput(mic);
      mic.amp(1);
      micReady = true;
    },
    err => {
      console.error("Mic start error:", err);
    }
  );
}

function mousePressed() {
  if (!audioStarted) {
    audioStarted = true;
    userStartAudio()
      .then(() => {
        console.log("🔊 Audio context started");
        startMic();
      })
      .catch(err => {
        console.error("userStartAudio failed:", err);
      });
  }
}

function draw() {
  if (micReady && fft) {
    // force FFT so getEnergy is valid
    fft.analyze();

    const bass   = fft.getEnergy("bass");
    const mids   = fft.getEnergy("mid");
    const treble = fft.getEnergy("treble");

    // ❗ SIMPLE THRESHOLD TRIGGERS (no rising-edge, no logs)
    if (bass > bassThresh) {
      xvec[storedind] = Math.random() * width;
      yvec[storedind] = Math.random() * height;
      rvals[storedind] = 255.0/255.0;
      gvals[storedind] = 0.0;
      bvals[storedind] = 0.0;
      storedind = (storedind + 1) % 5;
    }

    if (mids > midsThresh) {
      xvec[storedind] = Math.random() * width;
      yvec[storedind] = Math.random() * height;
      rvals[storedind] = 0.0;
      gvals[storedind] = 150.0 / 255.0;
      bvals[storedind] = 50.0 / 255.0;
      storedind = (storedind + 1) % 5;
    }

    if (treble > trebleThresh) {
      xvec[storedind] = Math.random() * width;
      yvec[storedind] = Math.random() * height;
      rvals[storedind] = 255.0/255.0;
      gvals[storedind] = 255.0/255.0;
      bvals[storedind] = 255.0/255.0;
      storedind = (storedind + 1) % 5;
    }
  }

  // push JS arrays into uniforms
  stored1 = [xvec[0], yvec[0]];
  stored2 = [xvec[1], yvec[1]];
  stored3 = [xvec[2], yvec[2]];
  stored4 = [xvec[3], yvec[3]];
  stored5 = [xvec[4], yvec[4]];

  col1 = [rvals[0], gvals[0], bvals[0]];
  col2 = [rvals[1], gvals[1], bvals[1]];
  col3 = [rvals[2], gvals[2], bvals[2]];
  col4 = [rvals[3], gvals[3], bvals[3]];
  col5 = [rvals[4], gvals[4], bvals[4]];

  shader(myShader);
  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_time', millis() / 1000.0);
  myShader.setUniform('u_stored1', stored1);
  myShader.setUniform('u_stored2', stored2);
  myShader.setUniform('u_stored3', stored3);
  myShader.setUniform('u_stored4', stored4);
  myShader.setUniform('u_stored5', stored5);
  myShader.setUniform('u_col1', col1);
  myShader.setUniform('u_col2', col2);
  myShader.setUniform('u_col3', col3);
  myShader.setUniform('u_col4', col4);
  myShader.setUniform('u_col5', col5);

  rect(0, 0, width, height);
}

function windowResized() {
  dimx = min(windowHeight - 300, windowWidth - 300);
  dimy = dimx;
  resizeCanvas(dimx, dimy);
}
