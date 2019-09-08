// const URL = 'http://127.0.0.1:80;
const URL = 'https://speakinto.space';


var video, reqBtn, startBtn, stopBtn, ul, stream, recorder, timer, recorderaud;
video = document.getElementById('video');
var videoWidth, videoHeight;
document.getElementById("video").volume = 0;

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
startBtn2 = document.getElementById('startaud');
stopBtn2 = document.getElementById('stopaud');
startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;
startBtn2.onclick = startAudio;
stopBtn2.onclick = stopAudio;
startBtn.disabled = true;
startBtn2.disabled = true;
stopBtn.disabled = true;
stopBtn2.disabled = true;

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
      startBtn2.classList.toggle("disabled");
      video.srcObject = stream;
      document.getElementById("target").style.display = "inline";
      document.getElementById("box").style.display = "inline";
    }).catch(e => console.error(e));
}

function startAudio() {
  recorderaud = new MediaRecorder(stream, {audioBitsPerSecond: 0});
  recorderaud.start();
  // stopBtn.removeAttribute('disabled');
  // startBtn.disabled = true;
  startBtn2.classList.toggle("disabled");
  stopBtn2.classList.toggle("disabled");
  startBtn.classList.toggle("disabled");
}

function stopAudio() {
  recorderaud.ondataavailable = e => {

    var formData = new FormData();
    formData.append('clip', e.data, document.getElementById("user").value.toString() + '.webm');
    console.log(typeof(e.data));
    console.log(document.getElementById("user").value.toString());
    var request = new XMLHttpRequest();
    request.open("POST", URL + "/formaud");
    request.onload = function() {
      console.log(this.responseText);
    }
    request.send(formData);
  };
  recorderaud.stop();
  if(timer) {
    clearTimeout(timer);
    timer = 0;
  }
//   stopBtn.removeAttribute('disabled');
//   startBtn.removeAttribute('disabled');
//   stopBtn.disabled = true;
  startBtn2.classList.toggle("disabled");
  stopBtn2.classList.toggle("disabled");
  startBtn.classList.toggle("disabled");
  stopBtn2.disabled = true;
  video.videoHeight=videoHeight
  video.videoWidth=videoWidth
  console.log("DONE")
}



function startRecording() {
  recorder = new MediaRecorder(stream, {audioBitsPerSecond: 0});
  recorder.start();
  document.getElementById('transcript-txt').value="";
  // stopBtn.removeAttribute('disabled');
  // startBtn.disabled = true;
  setTimeout(sendNew, 8000)

  startBtn.classList.toggle("disabled");
  startBtn2.classList.toggle("disabled");
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
  timer = setTimeout(sendNew, 8000)
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
  startBtn2.classList.toggle("disabled");
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
