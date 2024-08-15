const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
const RASPBERRY_PI_URL = 'http://192.168.1.81:5000';

app.post('/fingerprint/read', async (req, res) => {
    try {
        const response = await axios.post(`${RASPBERRY_PI_URL}/fingerprint/read`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer la huella', error: error.message });
    }
});

app.post('/fingerprint/enroll', async (req, res) => {
    try {
        const { id } = req.body;
        const response = await axios.post(`${RASPBERRY_PI_URL}/fingerprint/enroll`, { id });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al enrollar la huella', error: error.message });
    }
});

app.post('/fingerprint/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const response = await axios.post(`${RASPBERRY_PI_URL}/fingerprint/delete`, { id });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la huella', error: error.message });
    }
});

app.get('/fingerprint/list', async (req, res) => {
    try {
        const response = await axios.get(`${RASPBERRY_PI_URL}/fingerprint/list`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de huellas', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
