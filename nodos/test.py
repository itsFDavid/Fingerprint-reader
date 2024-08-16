import serial

uart = serial.Serial("/dev/ttyS0", baudrate=57600, timeout=1)

def send_command(command):
    uart.write(command)
    response = uart.read(20)  # Lee 12 bytes, ajusta según el comando esperado
    print("Comando enviado:", command)
    print("Respuesta recibida:", response)
    return response

# Comando de ejemplo, ajustar según la documentación del módulo
command = b'\xEF\x01\xFF\xFF\xFF\xFF\x01\x00\x03\x0A\x00\x0E'
send_command(command)
