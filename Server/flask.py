from flask import Flask, Response, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_data():
    print('Recieved from client: {}'.format(request.data))
    return Response('We recieved something…')

@app.route('/', methods=['POST'])
def get_data():
    print('Recieved from client: {}'.format(request.data))
    return Response('We recieved something…')

if __name__ == ‘__main__’:
    app.run(debug=True)
