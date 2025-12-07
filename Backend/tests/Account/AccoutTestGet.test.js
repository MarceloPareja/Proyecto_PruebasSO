const request = require('supertest');
const app = require('../../app'); 
const { loginAndGetToken } = require('../helper/loginhelper');
describe('Account API Tests GET', () => {
let authToken = '';

  beforeAll(async () => {
   authToken = await loginAndGetToken();
  });

    it('Prueba de obtencion de todas las cuentas - Exito', async () => {
        const response = await request(app)
            .post('/accounts')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('Prueba de obtención una cuenta por ID ',async () => {
        const response = await request(app)
            .post('/account/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accountId', 1);
    });

});