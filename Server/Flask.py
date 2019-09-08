#!/usr/bin/env python
from pathlib import Path
import os
from flask import Flask, Response, request, render_template, make_response
from werkzeug.utils import secure_filename
from google.cloud import texttospeech

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="../credentials.json"
# set up Google Cloud Text to Speech client
client = texttospeech.TextToSpeechClient()
voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-GB',
    ssml_gender=texttospeech.enums.SsmlVoiceGender.FEMALE)
audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3)

UPLOAD_DIR = './uploads'

app = Flask(__name__)

@app.route('/', methods=['GET'])
def basicHTML():
    return render_template("flask.html")

@app.route('/form', methods=['POST'])
def get_data():
    file = request.files['clip']
    file.save(os.path.join(UPLOAD_DIR, file.filename))
    print("Converting")
    os.system("ffmpeg -y -i "+ os.path.join(UPLOAD_DIR, file.filename) + ' -qscale 0 -filter:v "crop=300:300" -s 160x160 -r 25 ./proc_uploads/'+Path(os.path.join(UPLOAD_DIR, file.filename)).stem + ".mp4")
    os.system("mv ./proc_uploads/"+ Path(os.path.join(UPLOAD_DIR, file.filename)).stem + ".mp4  ../ML/media/example/demo.mp4")
    os.system("python ../ML/main.py --lip_model_path ../ML/models/lrs2_lip_model --gpu_id 0 --data_list ../ML/media/example/demo_list.txt --data_path ../ML/media/example")
    pred = open("../ML/prediction.txt","r+")
    answer = pred.read()
    f = open("video.txt", "a")
    f.write(str(file.filename) + "-------->" + answer)
    return str(answer)

@app.route('/clear', methods=['GET'])
def clear_uploads():
    for file in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, file)
        if os.path.isfile(path):
            os.unlink(path)

@app.route('/voice', methods=['POST'])
def get_voice():
    print(request.form.get('string'))
    string = request.form.get('string')
    print(string)
    text_input = texttospeech.types.SynthesisInput(text=string)
    audio = client.synthesize_speech(text_input, voice, audio_config)

    response = make_response(audio.audio_content)
    response.headers['Content-Type'] = 'audio/wav'
    response.headers['Content-Disposition'] = 'attachment; filename=voice.wav'

    return response

#TODO: Prepend a session/computer specific identifier to delete only the session specific files, for scaling.

@app.route('/purge' , methods=['GET'])
def purge():
    os.system("rm -rf uploads")
    os.system("mkdir uploads")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=80)
