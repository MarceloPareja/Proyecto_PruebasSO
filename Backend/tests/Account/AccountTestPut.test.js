const request = require('supertest');
const app = require('../../server'); 
const { loginAndGetToken } = require('../helper/loginhelper');
describe('Account API Tests Put', () => {
let authToken = '';

  beforeAll(async () => {
   authToken = await loginAndGetToken();
  });

  it('Prueba aactualizacion de una cuenta por ID - Exito', async () => {
    const response = await request(app)
        .put('/accounts/update/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: 'UpdatedName',
            lastname: 'UpdatedLastName',
            phoneNumber: '0987654321',
            email: 'emailcambiado@gmail.com'
        });
    expect(response.statusCode).toBe(200);  
    });

});