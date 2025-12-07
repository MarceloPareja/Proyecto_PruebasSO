const request = require('supertest');
const app = require('../../app'); 
const path = require('path');
const { loginAndGetToken } = require('../helper/loginhelper');

describe('Profile API Tests Post', () => {
let authToken = '';

  beforeAll(async () => {
    authToken = await loginAndGetToken();
  });

  it('Prueba actualizar un perfil de usuarios - Exito', async () => {
    const response = await request(app)
        .put('/profile/update/2')
        .send({
          title: 'Updated Test Title',
            bio: 'This is an updated test bio',
            address: '456 Updated St',
            profilePicture: '../Assets/mickey.jpg',
            accountId: '1'
        })
        .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);  
    });

});