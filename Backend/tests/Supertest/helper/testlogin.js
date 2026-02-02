const request = require('supertest');
const app = require('../../../app');  
const { openDBConnection } = require('./dbHelper');
let authToken = '';

const loginAndGetToken = async () => {
  if (authToken) return authToken;

  console.log('Iniciando login en prueba aislada...');
    await openDBConnection();
  const response = await request(app)
    .post('/legalsystem/account/login')
    .send({
      email: 'testinguser@gmail.com',
      password: 'p1234'
    });

  console.log('Login STATUS:', response.status);
  console.log('Login BODY:', JSON.stringify(response.body, null, 2));
  console.log('Login HEADERS:', response.headers);

  if (response.status !== 200) {
    throw new Error(`Login falló: ${response.status} - ${response.text || 'sin mensaje'}`);
  }

  if (!response.body.token) {
    throw new Error('No token en la respuesta');
  }

  authToken = response.body.token;
  console.log('Token generado OK (primeros 20 chars):', authToken.substring(0, 20) + '...');
  return authToken;
};

// Ejecutar la función directamente
(async () => {
  try {
    const token = await loginAndGetToken();
    console.log('¡ÉXITO! Token completo:', token);
  } catch (err) {
    console.error('Fallo en login:', err.message);
  }
})();