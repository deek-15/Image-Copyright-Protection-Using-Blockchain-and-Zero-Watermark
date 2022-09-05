from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from generateOwner import generate
import re
from extractWatermark import extract
import traceback

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/")
@cross_origin(supports_credentials=True)
def index() :
    return jsonify({"message" : "Hello"})

@app.route("/generate", methods=['POST'])
@cross_origin(supports_credentials=True)
def generateOwnership() :
    try :
        image = request.form['image']
        logo = request.form['logo']
        imageStr = re.sub('data:image\/.+;base64,', '', image)
        logoStr = re.sub('data:image\/.+;base64,', '', logo)
        # print(logoStr[:100])

        (encoded_zeroR, encoded_zeroG, encoded_zeroB , key1, key2) = generate(imageStr, logoStr)
        
        return jsonify({"message" : "Success", "key1" : key1, "key2" : key2, "ZWR" : encoded_zeroR, "ZWG" : encoded_zeroG, "ZWB" : encoded_zeroB})

    except Exception as err :
        # print(err)
        print(''.join(traceback.format_exception(etype=type(err), value=err, tb=err.__traceback__)))
        return jsonify({"error" : err.__str__()})

@app.route("/extract", methods=['POST'])
@cross_origin(supports_credentials=True)
def extractOwnership() :
    try :
        image = request.form['image']
        ownerR = request.form['ownerR']
        ownerG = request.form['ownerG']
        ownerB = request.form['ownerB']
        key1 = float(request.form['key1'])
        key2 = float(request.form['key2'])

        imageStr = re.sub('data:image\/.+;base64,', '', image)
        ownerRStr = re.sub('data:image\/.+;base64,', '', ownerR)
        ownerGStr = re.sub('data:image\/.+;base64,', '', ownerG)
        ownerBStr = re.sub('data:image\/.+;base64,', '', ownerB)

        logoImage = extract(imageStr, ownerRStr, ownerGStr, ownerBStr, key1, key2)
        
        return jsonify({"message" : "Success", "logoImage" : logoImage})

    except Exception as err :
        # print(err)
        print(''.join(traceback.format_exception(etype=type(err), value=err, tb=err.__traceback__)))
        return jsonify({"error" : err.__str__()})

if __name__ == "__main__" :
    app.run(debug=True)