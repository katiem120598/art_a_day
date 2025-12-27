let myShader;
let mic, fft;
let micReady = false;
let audioStarted = false;

let storedind = 0;
let stored1 = [0,0]
let stored2 = [0,0.0]
let stored3 = [0,0]
let stored4 = [0,0]
let stored5 = [0,0]
let rvals = [0,0,0,0,0];
let gvals = [0,0,0,0,0];
let bvals = [0,0,0,0,0];
let col1 = [0,0,0];
let col2 = [0,0,0];
let col3 = [0,0,0];
let col4 = [0,0,0];
let col5 = [0,0,0];
let xvec = [0,0,0,0,0];
let yvec = [0,0,0,0,0];

let timevec = [0,0,0,0,0];
let time1 = 0.0;
let time2 = 0.0;
let time3 = 0.0;
let time4 = 0.0;
let time5 = 0.0;

let prevBass = 0.0;
let prevMids = 0.0;
let prevTreble = 0.0;

let bassTrans = 0.0;
let midsTrans = 0.0;
let trebleTrans = 0.0;

let bassThresh = 200.0;
let midsThresh = 150.0;
let trebleThresh = 90.0;

let dimx, dimy;

function preload() {
  myShader = loadShader('vshader.vert', 'fshader.frag');
}

function setup() {
  dimx = min(windowHeight-300, windowWidth-300);
  dimy = dimx;
  let c = createCanvas(dimx,dimy,WEBGL);
  c.elt.style.border = "1px solid #373737ff";
  pixelDensity(1);
  shader(myShader);

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

function draw() {
  if (micReady && fft) {
    // force FFT so getEnergy is valid
    fft.analyze();

    const bass   = fft.getEnergy("bass");
    const mids   = fft.getEnergy("mid");
    const treble = fft.getEnergy("treble");

    bassTrans = (prevBass<bassThresh && bass>=bassThresh)?1.0:0.0;
    midsTrans = (prevMids<midsThresh && mids>=midsThresh)?1.0:0.0;
    trebleTrans = (prevTreble<trebleThresh && treble>=trebleThresh)?1.0:0.0;



    if (bassTrans){
      xvec[storedind] = Math.random()*width;
      yvec[storedind] = Math.random()*height;
      rvals[storedind] = 225.0/255.0;
      gvals[storedind] = 0.0;
      bvals[storedind] = 0.0;
      timevec[storedind] = millis()/1000.0;
      storedind = (storedind + 1) % 5;
    }

    if (midsTrans){
      xvec[storedind] = Math.random()*width;
      yvec[storedind] = Math.random()*height;
      rvals[storedind] = 0.0;
      gvals[storedind] = 150.0/255.0;
      bvals[storedind] = 50.0/255.0;
      timevec[storedind] = millis()/1000.0;
      storedind = (storedind + 1) % 5;
    }

    if (trebleTrans){
      xvec[storedind] = Math.random()*width;
      yvec[storedind] = Math.random()*height;
      rvals[storedind] = 245.0/255.0;
      gvals[storedind] = 245.0/255.0;
      bvals[storedind] = 245.0/255.0;
      timevec[storedind] = millis()/1000.0;
      storedind = (storedind + 1) % 5;
    }
    prevBass = bass;
    prevMids = mids;
    prevTreble = treble;
  }

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
  time1 = millis()/1000.0-timevec[0];
  time2 = millis()/1000.0-timevec[1];
  time3 = millis()/1000.0-timevec[2];
  time4 = millis()/1000.0-timevec[3];
  time5 = millis()/1000.0-timevec[4];
  myShader.setUniform('u_resolution', [width, height]);
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
  myShader.setUniform('u_time1', time1);
  myShader.setUniform('u_time2', time2);
  myShader.setUniform('u_time3', time3);
  myShader.setUniform('u_time4', time4);
  myShader.setUniform('u_time5', time5);

  rect(0, 0, width, height);
}

function windowResized() {
  dimx = min(windowHeight-300, windowWidth-300);
  dimy = dimx;
  resizeCanvas(dimx,dimy);
}