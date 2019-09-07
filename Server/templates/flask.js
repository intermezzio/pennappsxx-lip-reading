var video, reqBtn, startBtn, stopBtn, ul, stream, recorder, timer;
video = document.getElementById('video');
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
      startBtn.removeAttribute('disabled');
    }).catch(e => console.error(e));
}

function startRecording() {
  recorder = new MediaRecorder(stream, {audioBitsPerSecond: 0});
  recorder.start();
  document.getElementById('transcript-txt').textContent="";
  video.srcObject = stream;
  stopBtn.removeAttribute('disabled');
  startBtn.disabled = true;
  setTimeout(sendNew, 3000)

}

function sendNew(){
  recorder.ondataavailable = e => {

    var formData = new FormData();
    formData.append('clip', e.data,  (new Date() + '').slice(4, 28).toString() + '.webm');
    console.log(typeof(e.data));
    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/form");
    request.onload = function() {
      document.getElementById('transcript-txt').textContent=this.responseText;
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
    formData.append('clip', e.data, (new Date() + '').slice(4, 28).toString() + '.webm');
    console.log(typeof(e.data));
    var request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:5000/form");
    request.onload = function() {
      console.log(this.responseText);
    }
    request.send(formData);
  };
  recorder.stop();
  if(timer) {
    clearTimeout(timer);
    timer = 0;
  }
  video.srcObject = null;
  stopBtn.removeAttribute('disabled');
  startBtn.removeAttribute('disabled');
  stopBtn.disabled = true;
}

function textToSpeech(text) {
  var request = new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:5000/voice");
  request.onload = function() {
    // I don't think this will actually work
    var audio = new Audio(this.responseText);
    audio.play();
  }
  request.send(text);
}
