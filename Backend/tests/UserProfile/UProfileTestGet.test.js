const request = require('supertest');
const app = require('../../server'); 
const { loginAndGetToken } = require('../helper/loginhelper');

describe('Profile API Tests Get', () => {
let authToken = '';

  beforeAll(async () => {
    authToken = await loginAndGetToken();
  });

  it('Prueba obtener perfil de usuarios', async () => {
    const response = await request(app)
        .get('/profiles')
        .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);  
    });

  it('Prueba obtener perfil de usuario por ID - Exito', async () => {
    const response = await request(app)
        .get('/profiles/1')
        .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);  
    });
});