# Proyecto de Aplicación en Raspberry Pi

Este proyecto es una aplicación que se ejecuta en una Raspberry Pi. A continuación, encontrarás los pasos necesarios para ejecutar la aplicación correctamente.

## Requisitos

**Raspberry**
- Una Raspberry Pi con acceso a internet.
- Docker y Docker Compose instalados en la Raspberry Pi.

**Servidor**
- npm node

**Frontend**
- React
- Vite

## Acceso a la Raspberry Pi

1. Primero, accede a tu Raspberry Pi por medio de SSH:

```bash
ssh pi@<IP_DE_TU_RASPBERRY_PI>

#Ejemplo:
ssh pi@192.168.1.50

```

**Ten en cuenta que el usuario y la ip puede variar de acuerdo a tu configuracion**

## Configuracion y ejecucion de la aplicacion
*Nota*

**Si no tienes docker clona este repositorio y ejecuta el script install_docker**
```bash
./install_docker.sh 
```

2. Descarga la imagen en la raspberry pi
```bash
sudo docker pull fdavid04/test2:latest
```
3. Ejecuta la imagen

```bash
sudo docker run --privileged -d -p 5000:5000 fdavid04/test2:latest
```
## Ejecucion del servidor backend
- **Carpeta:**  [Servidor backend](server)

4. Inicia el servidor
```bash
npm run dev
```

## Ejecucion de la app frontend
- **Carpeta:**  [App frontend](frontend/mi-app-react/)

**Modo Desarrollo**
```bash
npm run dev
```
**Produccion**
```bash
npm start
```







