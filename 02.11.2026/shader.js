let myShader;
let mic, fft, micReady = false;
let fftTexture;
let useSpec = 1.0;
let useTail = 1.0;
let audioStarted = false;

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
      fft = new p5.FFT(0.0, 1024);
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
    fft.analyze();

    //convert waveform to image
    let waveform = fft.waveform();
    let waveformImg = floatArrayToImage(waveform);
    
    //convert spectrum to image
    let spectrum = fft.analyze();
    let spectrumImg = byteArrayToImage(spectrum);

    //console.log(fft.getEnergy("bass"));
    myShader.setUniform('u_resolution', [width, height]);
    myShader.setUniform('u_time', 0.001 * millis());
    myShader.setUniform('u_waveform', waveformImg);
    myShader.setUniform('u_spectrum', spectrumImg);

    rect(0, 0, width, height);
  }
}

function floatArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = (0.5 + 0.5 * array[i]) * 255;
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}

function byteArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = array[i];
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}

function windowResized() {
  dimx = min(windowHeight-300, windowWidth-300);
  dimy = dimx;
  resizeCanvas(dimx,dimy);
}