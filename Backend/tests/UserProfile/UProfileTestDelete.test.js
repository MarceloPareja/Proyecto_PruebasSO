const request = require('supertest');
const app = require('../../app'); 
const { loginAndGetToken } = require('../helper/loginhelper');

describe('Profile API Tests Get', () => {
let authToken = '';

  beforeAll(async () => {
    authToken = await loginAndGetToken();
  });

  it('Prueba eliminar perfil de usuarios - Exito', async () => {
    const response = await request(app)
        .delete('/profile/delete/2')
        .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);  
    });

});