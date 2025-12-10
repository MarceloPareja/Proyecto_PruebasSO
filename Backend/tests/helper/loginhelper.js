const request = require('supertest');
const app = require('../../server'); 

let authToken = '';

const loginAndGetToken = async () => {
  if (authToken) return authToken; 

  const response = await request(app)
    .post('/legalsystem/account/login')
    .send({
      email: 'testuser@espe.edu.ec',
      password: '123456'
    });

  if (response.status !== 200) {
    throw new Error(`Login falló: ${response.status} - ${response.text}`);
  }

  if (!response.body.token) {
    throw new Error('No se recibió token en el login');
  }

  authToken = response.body.token;
  return authToken;
};


module.exports = {
  loginAndGetToken
};