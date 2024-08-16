from flask import Flask, request, jsonify
import time
import serial
import adafruit_fingerprint

app = Flask(__name__)

uart = serial.Serial("/dev/ttyS0", baudrate=57600, timeout=1)
finger = adafruit_fingerprint.Adafruit_Fingerprint(uart)

def get_fingerprint():
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False
    if finger.finger_search() != adafruit_fingerprint.OK:
        return False
    return True

def enroll_finger(location):
    for fingerimg in range(1, 3):
        while True:
            i = finger.get_image()
            if i == adafruit_fingerprint.OK:
                break
            if i == adafruit_fingerprint.NOFINGER:
                pass
            else:
                return False

        i = finger.image_2_tz(fingerimg)
        if i != adafruit_fingerprint.OK:
            return False

        if fingerimg == 1:
            time.sleep(1)
            while i != adafruit_fingerprint.NOFINGER:
                i = finger.get_image()

    i = finger.create_model()
    if i != adafruit_fingerprint.OK:
        return False

    i = finger.store_model(location)
    if i != adafruit_fingerprint.OK:
        return False

    return True

@app.route('/fingerprint/read', methods=['POST'])
def read_fingerprint():
    if get_fingerprint():
        return jsonify({"status": "success", "finger_id": finger.finger_id, "confidence": finger.confidence})
    else:
        return jsonify({"status": "failure", "message": "Finger not found"})

@app.route('/fingerprint/enroll', methods=['POST'])
def enroll_fingerprint():
    location = request.json.get('id')
    if enroll_finger(location):
        return jsonify({"status": "success", "message": "Fingerprint enrolled"})
    else:
        return jsonify({"status": "failure", "message": "Failed to enroll fingerprint"})

@app.route('/fingerprint/delete', methods=['POST'])
def delete_fingerprint():
    location = request.json.get('id')
    if finger.delete_model(location) == adafruit_fingerprint.OK:
        return jsonify({"status": "success", "message": "Fingerprint deleted"})
    else:
        return jsonify({"status": "failure", "message": "Failed to delete fingerprint"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
