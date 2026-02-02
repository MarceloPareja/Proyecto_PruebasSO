const request = require('supertest');
const app = require('../../../app');

let authToken = null;

const loginAndGetToken = async () => {
  if (authToken) return authToken;

  console.log('Iniciando login en tests...');

  let retries = 5;
  while (retries > 0) {
    try {
      const response = await request(app)
        .post('/legalsystem/account/login')
        .send({
          email: 'testinguser@gmail.com',
          password: 'p1234'
        })
        .timeout(15000); // ← Timeout explícito por request

      if (response.status !== 200) {
        throw new Error(`Login falló: ${response.status} - ${response.text || 'sin mensaje'}`);
      }

      if (!response.body.token) {
        throw new Error('No token en la respuesta');
      }

      authToken = response.body.token;
      return authToken;
    } catch (err) {
      retries--;
      console.error('Login retry falló (restan', retries, '):', err.message);
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, 3000)); // espera 3s
    }
  }
};

module.exports = { loginAndGetToken };