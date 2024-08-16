# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

import time
import serial
import adafruit_fingerprint
from PIL import Image
import os

# Configuración del puerto serial
uart = serial.Serial("/dev/ttyUSB0", baudrate=57600, timeout=1)
finger = adafruit_fingerprint.Adafruit_Fingerprint(uart)

# Carpeta donde se almacenan las plantillas de huellas
FINGERPRINT_FOLDER = "fingerprint/"

##################################################
# Funciones de Enrolamiento y Verificación
##################################################

def get_fingerprint():
    """Obtiene una imagen de huella dactilar, la procesa y verifica si coincide con una huella almacenada."""
    print("Esperando imagen de huella...")
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    print("Procesando...")
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False
    print("Buscando coincidencias...")
    if finger.finger_search() != adafruit_fingerprint.OK:
        return False
    return True

def get_fingerprint_detail():
    """Obtiene una imagen de huella dactilar, la procesa y detalla los errores en caso de fallo."""
    print("Obteniendo imagen...", end="")
    i = finger.get_image()
    if i == adafruit_fingerprint.OK:
        print("Imagen capturada")
    else:
        print("Error al capturar imagen")
        return False

    print("Procesando...", end="")
    i = finger.image_2_tz(1)
    if i == adafruit_fingerprint.OK:
        print("Imagen procesada")
    else:
        print("Error al procesar imagen")
        return False

    print("Buscando coincidencias...", end="")
    i = finger.finger_fast_search()
    if i == adafruit_fingerprint.OK:
        print("¡Huella dactilar encontrada!")
        return True
    else:
        print("No se encontró coincidencia")
        return False

def enroll_finger(location):
    """Enrola una huella dactilar en la ubicación especificada."""
    for fingerimg in range(1, 3):
        if fingerimg == 1:
            print("Coloca el dedo en el sensor...", end="")
        else:
            print("Coloca el mismo dedo nuevamente...", end="")

        while True:
            i = finger.get_image()
            if i == adafruit_fingerprint.OK:
                print("Imagen capturada")
                break
            if i == adafruit_fingerprint.NOFINGER:
                print(".", end="")
            else:
                print("Error al capturar imagen")
                return False

        print("Procesando...", end="")
        i = finger.image_2_tz(fingerimg)
        if i == adafruit_fingerprint.OK:
            print("Imagen procesada")
        else:
            print("Error al procesar imagen")
            return False

        if fingerimg == 1:
            print("Remueve el dedo")
            time.sleep(1)
            while i != adafruit_fingerprint.NOFINGER:
                i = finger.get_image()

    print("Creando modelo...", end="")
    i = finger.create_model()
    if i == adafruit_fingerprint.OK:
        print("Modelo creado")
    else:
        print("Error al crear modelo")
        return False

    print("Guardando modelo en la ubicación #%d..." % location, end="")
    i = finger.store_model(location)
    if i == adafruit_fingerprint.OK:
        print("Modelo guardado")
    else:
        print("Error al guardar modelo")
        return False

    return True

##################################################
# Funciones de Guardado y Comparación desde Archivo
##################################################

def save_fingerprint_image(filename):
    """Escanea la huella dactilar y guarda la imagen en un archivo."""
    while finger.get_image():
        pass

    img = Image.new("L", (256, 288), "white")
    pixeldata = img.load()
    mask = 0b00001111
    result = finger.get_fpdata(sensorbuffer="image")

    x, y = 0, 0
    for i in range(len(result)):
        pixeldata[x, y] = (int(result[i]) >> 4) * 17
        x += 1
        pixeldata[x, y] = (int(result[i]) & mask) * 17
        if x == 255:
            x = 0
            y += 1
        else:
            x += 1

    if not img.save(filename):
        return True
    return False

def enroll_save_to_file():
    """Enrola una huella dactilar y guarda el modelo en un archivo."""
    for fingerimg in range(1, 3):
        if fingerimg == 1:
            print("Coloca el dedo en el sensor...", end="")
        else:
            print("Coloca el mismo dedo nuevamente...", end="")

        while True:
            i = finger.get_image()
            if i == adafruit_fingerprint.OK:
                print("Imagen capturada")
                break
            if i == adafruit_fingerprint.NOFINGER:
                print(".", end="")
            else:
                print("Error al capturar imagen")
                return False

        print("Procesando...", end="")
        i = finger.image_2_tz(fingerimg)
        if i == adafruit_fingerprint.OK:
            print("Imagen procesada")
        else:
            print("Error al procesar imagen")
            return False

        if fingerimg == 1:
            print("Remueve el dedo")
            while i != adafruit_fingerprint.NOFINGER:
                i = finger.get_image()

    print("Creando modelo...", end="")
    i = finger.create_model()
    if i == adafruit_fingerprint.OK:
        print("Modelo creado")
    else:
        print("Error al crear modelo")
        return False

    print("Descargando plantilla...")
    data = finger.get_fpdata("char", 1)
    # Guardar la plantilla con un nombre único basado en la hora actual
    filename = os.path.join(FINGERPRINT_FOLDER, f"template_{int(time.time())}.dat")
    with open(filename, "wb") as file:
        file.write(bytearray(data))
    print(f"Plantilla guardada en {filename}")

    return True

def fingerprint_check_folder():
    """Compara una nueva huella dactilar con plantillas almacenadas en una carpeta."""
    print("Esperando huella dactilar...")
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    print("Procesando...")
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False

    print("Buscando coincidencias en la carpeta...", end="")
    found_match = False
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
                found_match = True
                break  # Detener la búsqueda después de encontrar una coincidencia

    if found_match:
        print(f"¡Huella dactilar coincide con la plantilla en el archivo {matched_filename}!")
    else:
        print("No se encontró ninguna coincidencia.")

    return found_match

##################################################
# Ciclo Principal del Programa
##################################################

while True:
    print("----------------")
    if finger.read_templates() != adafruit_fingerprint.OK:
        raise RuntimeError("No se pudo leer las plantillas")
    print("Plantillas de huellas dactilares: ", finger.templates)
    if finger.count_templates() != adafruit_fingerprint.OK:
        raise RuntimeError("No se pudo contar las plantillas")
    print("Número de plantillas encontradas: ", finger.template_count)
    if finger.read_sysparam() != adafruit_fingerprint.OK:
        raise RuntimeError("No se pudieron obtener los parámetros del sistema")
    print("Tamaño de la biblioteca de plantillas: ", finger.library_size)
    print("e) Enrolar huella")
    print("f) Buscar huella")
    print("d) Eliminar huella")
    print("s) Guardar imagen de huella")
    print("cf) Comparar huella con carpeta")
    print("esf) Enrolar y guardar en archivo")
    print("r) Resetear biblioteca")
    print("q) Salir")
    print("----------------")
    c = input("> ")

    if c == "e":
        enroll_finger(get_num(finger.library_size))
    if c == "f":
        if get_fingerprint():
            print("Huella dactilar detectada con ID #", finger.finger_id, "y confianza", finger.confidence)
        else:
            print("Huella no encontrada")
    if c == "d":
        if finger.delete_model(get_num(finger.library_size)) == adafruit_fingerprint.OK:
            print("¡Eliminado!")
        else:
            print("Error al eliminar")
    if c == "s":
        if save_fingerprint_image("fingerprint.png"):
            print("Imagen de huella guardada")
        else:
            print("Error al guardar la imagen")
    if c == "cf":
        fingerprint_check_folder()
    if c == "esf":
        enroll_save_to_file()
    if c == "r":
        if finger.empty_library() == adafruit_fingerprint.OK:
            print("¡Biblioteca vacía!")
        else:
            print("Error al vaciar la biblioteca")
    if c == "q":
        print("Saliendo del programa de huellas dactilares")
        raise SystemExit
