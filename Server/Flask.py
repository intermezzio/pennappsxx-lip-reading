#!/usr/bin/env python
from flask import Flask, Response, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])
def basicHTML():
    return render_template("flask.html")

@app.route('/form', methods=['POST'])
def get_data():
    print('Recieved from client: {}'.format(request.data))
    return Response('We received something...')

if __name__ == '__main__':
    app.run(debug=True)
