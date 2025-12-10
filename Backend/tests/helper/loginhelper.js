const request = require('supertest');
const app = require('../../app'); 

let authToken = '';

const loginAndGetToken = async () => {
  if (authToken) return authToken; 

  const response = await request(app)
    .post('/legalsystem/account/login')
    .send({
      email: 'testuser@gmail.com',
      password: 'test1234'
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