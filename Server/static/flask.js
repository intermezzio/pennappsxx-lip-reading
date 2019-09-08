const URL = 'http://127.0.0.1:5000';
// const URL = 'http://3.210.181.96:5000';


var video, reqBtn, startBtn, stopBtn, ul, stream, recorder, timer;
video = document.getElementById('video');
var videoWidth, videoHeight;
var getVideoSize = function() {
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.removeEventListener('loadedmetadata', getVideoSize, false);
    console.log("TEST")
};
video.addEventListener('loadedmetadata', getVideoSize, false);
reqBtn = document.getElementById('request');
startBtn = document.getElementById('start');
stopBtn = document.getElementById('stop');
reqBtn.onclick = requestVideo;
startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;
startBtn.disabled = true;
stopBtn.disabled = true;

function requestVideo() {
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    .then(stm => {
      stream = stm;
      reqBtn.style.display = 'none';
      // startBtn.removeAttribute('disabled');
      startBtn.classList.toggle("disabled");
      video.srcObject = stream;
      document.getElementById("target").style.display = "inline";
      document.getElementById("box").style.display = "inline";
    }).catch(e => console.error(e));
}

function startRecording() {
  recorder = new MediaRecorder(stream, {audioBitsPerSecond: 0});
  recorder.start();
  document.getElementById('transcript-txt').value="";
  // stopBtn.removeAttribute('disabled');
  // startBtn.disabled = true;
  setTimeout(sendNew, 5000)

  startBtn.classList.toggle("disabled");
  stopBtn.classList.toggle("disabled");
}

function sendNew(){
  recorder.ondataavailable = e => {

    var formData = new FormData();
    formData.append('clip', e.data,  (new Date().toISOString() + '').slice(4, 28).toString() + '.webm');
    console.log(typeof(e.data));
    var request = new XMLHttpRequest();
    request.open("POST", URL + "/form");
    request.onload = function() {
      console.log(this.responseText);
      document.getElementById('transcript-txt').value=this.responseText;
    }
    request.send(formData);

  };
  recorder.stop();
  recorder.start();
  timer = setTimeout(sendNew, 3000)
}


function stopRecording() {
  recorder.ondataavailable = e => {

    var formData = new FormData();
    formData.append('clip', e.data, (new Date().toISOString() + '').slice(4, 28).toString() + '.webm');
    console.log(typeof(e.data));
    var request = new XMLHttpRequest();
    request.open("POST", URL + "/form");
    request.onload = function() {
      console.log(this.responseText);
      document.getElementById('transcript-txt').value = this.responseText;
    }
    request.send(formData);
  };
  recorder.stop();
  if(timer) {
    clearTimeout(timer);
    timer = 0;
  }
//   stopBtn.removeAttribute('disabled');
//   startBtn.removeAttribute('disabled');
//   stopBtn.disabled = true;
  startBtn.classList.toggle("disabled");
  stopBtn.classList.toggle("disabled");
  stopBtn.disabled = true;
  video.videoHeight=videoHeight
  video.videoWidth=videoWidth
  console.log("DONE")
}

function textToSpeech(text) {
  var context = new AudioContext();

  var formData = new FormData();
  formData.append("string", text);
  var request = new XMLHttpRequest();
  request.open("POST", URL + "/voice");
  request.responseType = "arraybuffer";
  request.onload = function() {
    context.decodeAudioData(request.response, buffer => {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  }
  request.send(formData);
}
