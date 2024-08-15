import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Asegúrate de que este puerto coincida con el de tu servidor backend

// Función para leer una huella
export const readFingerprint = async () => {
    try {
        const response = await axios.post(`${API_URL}/fingerprint/read`);
        return response.data;
    } catch (error) {
        return error;
    }
};

// Función para enrollar una huella
export const enrollFingerprint = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/fingerprint/enroll`, { id });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Función para eliminar una huella
export const deleteFingerprint = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/fingerprint/delete`, { id });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const listFingerprints = async () => {
    try {
        const response = await axios.get(`${API_URL}/fingerprint/list`);
        return response.data;
    } catch (error) {
        return error;
    }
}