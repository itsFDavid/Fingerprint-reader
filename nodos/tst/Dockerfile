# Usa una imagen base compatible con Raspberry Pi
FROM arm32v7/python:3.9

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al directorio de trabajo
COPY . .

# Instala las dependencias de tu aplicación
RUN pip install --no-cache-dir virtualenv \
    && python3 -m virtualenv .venv \
    && . .venv/bin/activate \
    && pip install --no-cache-dir adafruit-circuitpython-fingerprint flask

# Expone el puerto en el que tu aplicación está escuchando
EXPOSE 5000

# Define el comando que se ejecutará cuando se inicie el contenedor
CMD [".venv/bin/python", "test2.py"]
