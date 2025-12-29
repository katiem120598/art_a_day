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
    userStartAudio().then(() => {
      startMic();
      audioStarted = true;
    });
  }
}

function startMic() {
  navigator.mediaDevices.enumerateDevices().then(devices => {
    let vbDevice = devices.find(d => d.label.includes("CABLE Output"));
    if (vbDevice) {
      mic = new p5.AudioIn(false, vbDevice.deviceId);
      mic.start(() => {
        console.log("✅ VB-Audio Cable selected and started!");
        fft = new p5.FFT();
        fft.setInput(mic);
        mic.amp(1);
        micReady = true;
      });
    } else {
      console.warn("❌ VB-Audio Cable not found!");
    }
  });
}

function draw() {
  if (!micReady) return;

  let bass = fft.getEnergy("bass");
  let mids = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  //convert waveform to image
  let waveform = fft.waveform();
  let waveformImg = floatArrayToImage(waveform);
  
  //convert spectrum to image
  let spectrum = fft.analyze();
  let spectrumImg = byteArrayToImage(spectrum);

  //console.log(fft.getEnergy("bass"));
  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_mouse', [mouseX, height - mouseY]);
  myShader.setUniform('u_time', 0.001 * millis());
  myShader.setUniform('u_bass', bass/255.0);
  myShader.setUniform('u_mids', mids/255.0);
  myShader.setUniform('u_treble', treble/255.0);
  myShader.setUniform('u_waveform', waveformImg);
  myShader.setUniform('u_spectrum', spectrumImg);
  myShader.setUniform('u_key1', useSpec);
  myShader.setUniform('u_key2', useTail);

  rect(0, 0, width, height);
}

function keyPressed(){
  if (key == '1'){
    useSpec = 1.0 - useSpec;
  }
  if (key == '2'){
    useTail = 1.0 - useTail;
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