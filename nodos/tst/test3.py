from flask import Flask, request, jsonify
import time
import serial
import adafruit_fingerprint
import os
import json

app = Flask(__name__)

# Configuración del puerto serial
uart = serial.Serial("/dev/ttyUSB0", baudrate=57600, timeout=1)
finger = adafruit_fingerprint.Adafruit_Fingerprint(uart)

# Carpeta donde se almacenan las plantillas de huellas
FINGERPRINT_FOLDER = "fingerprint/"

def save_fingerprint_template():
    """Enrola una huella dactilar y guarda el modelo en un archivo."""
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

    print("Descargando plantilla...")
    data = finger.get_fpdata("char", 1)
    # Guardar la plantilla con un nombre único basado en la hora actual
    filename = os.path.join(FINGERPRINT_FOLDER, f"template_{int(time.time())}.dat")
    with open(filename, "wb") as file:
        file.write(bytearray(data))
    print(f"Plantilla guardada en {filename}")

    return True

def compare_fingerprint_with_files():
    """Compara una nueva huella dactilar con plantillas almacenadas en archivos."""
    print("Esperando huella dactilar...")
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    print("Procesando...")
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False

    print("Buscando coincidencias en la carpeta...")
    matched_filename = None

    for filename in os.listdir(FINGERPRINT_FOLDER):
        if filename.endswith(".dat"):
            file_path = os.path.join(FINGERPRINT_FOLDER, filename)
            with open(file_path, "rb") as file:
                data = file.read()
            finger.send_fpdata(list(data), "char", 2)
            i = finger.compare_templates()
            if i == adafruit_fingerprint.OK:
                matched_filename = filename
                break  # Detener la búsqueda después de encontrar una coincidencia

    if matched_filename:
        print(f"¡Huella dactilar coincide con la plantilla en el archivo {matched_filename}!")
        return matched_filename
    else:
        print("No se encontró ninguna coincidencia.")
        return None

@app.route('/guardar-hora', methods=['POST'])
def guardar_hora():
    data = request.json
    tipo = data['tipo']
    hora = data['hora']

    registro = {"tipo": tipo, "hora": hora}
    print(f"Datos recibidos {registro}")
    # Verifica si el archivo JSON ya existe
    if os.path.exists('registro_horas.json'):
        with open('registro_horas.json', 'r+') as f:
            registros = json.load(f)
            registros.append(registro)
            f.seek(0)
            json.dump(registros, f, indent=4)
    else:
        with open('registro_horas.json', 'w') as f:
            json.dump([registro], f, indent=4)

    return jsonify({"status": "success", "message": "Hora registrada correctamente"})


@app.route('/fingerprint/save', methods=['POST'])
def save_fingerprint():
    if save_fingerprint_template():
        return jsonify({"status": "success", "message": "Fingerprint saved"})
    else:
        return jsonify({"status": "failure", "message": "Failed to save fingerprint"})

@app.route('/fingerprint/compare', methods=['POST'])
def compare_fingerprint():
    matched_file = compare_fingerprint_with_files()
    if matched_file:
        return jsonify({"status": "success", "message": f"Fingerprint matches with {matched_file}"})
    else:
        return jsonify({"status": "failure", "message": "No match found"})

if __name__ == '__main__':
    if not os.path.exists(FINGERPRINT_FOLDER):
        os.makedirs(FINGERPRINT_FOLDER)
    app.run(host='0.0.0.0', port=3000)
