#!/usr/bin/env python
import os
from flask import Flask, Response, request, render_template
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/', methods=['GET'])
def basicHTML():
    return render_template("flask.html")

@app.route('/form', methods=['POST'])
def get_data():
    file = request.files['clip']
    file.save(os.path.join('./uploads', file.filename))

    return Response('We received something...')


#TODO: Prepend a session/computer specific identifier to delete only the session specific files, for scaling.

@app.route('/purge' , methods=['GET'])
def purge():
    os.system("rm -rf uploads")
    os.system("mkdir uploads")

if __name__ == '__main__':
    app.run(debug=True)
