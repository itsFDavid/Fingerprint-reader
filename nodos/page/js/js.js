const URL_RASPBERRY = 'http://192.168.1.81:3000';

async function registrarHora(tipo) {
    const response = await fetch(`${URL_RASPBERRY}/fingerprint/compare`, {
        method: 'POST',
    });

    const result = await response.json();

    if (result.status === 'success') {
        const fecha = new Date();
        const hora = fecha.toISOString();
        const data = { tipo, hora };
        
        await fetch(`${URL_RASPBERRY}/guardar-hora`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status=== 'success') {
                document.getElementById('message').innerHTML = response.message;
            }else{
                document.getElementById('message').innerHTML = 'Error al registrar la hora';
            }

            
        });
    } else {
    }
}
