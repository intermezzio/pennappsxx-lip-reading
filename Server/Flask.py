#!/usr/bin/env python
import os
from flask import Flask, Response, request, render_template
from werkzeug.utils import secure_filename
from google.cloud import texttospeech

# set up Google Cloud Text to Speech client
client = texttospeech.TextToSpeechClient()
voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-GB',
    ssml_gender=texttospeech.enums.SsmlVoiceGender.FEMALE)
audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3)

UPLOADS_DIR = './uploads'
app = Flask(__name__)

@app.route('/', methods=['GET'])
def basicHTML():
    return render_template("flask.html")

@app.route('/form', methods=['POST'])
def get_data():
    file = request.files['clip']
    file.save(os.path.join(UPLOAD_DIR, file.filename))
    return Response('We received something...')

@app.route('/clear', methods=['GET'])
def clear_uploads():
    for file in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, file)
        if os.path.isfile(path):
            os.unlink(path)

@app.route('/voice', methods=['POST'])
def get_voice():
    string = request.args.get('string', type=str)
    text_input = texttospeech.types.SynthesisInput(text=string)
    response = client.synthesize_speech(text_input, voice, audio_config)
    return Response(response.audio_content, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(debug=True)
