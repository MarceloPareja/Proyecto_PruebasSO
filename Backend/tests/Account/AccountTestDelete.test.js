const request = require('supertest');
const app = require('../../app'); 
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

describe('Account API Tests Delete', () => {
let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
   authToken = await loginAndGetToken();
  });

  it('Prueba de eliminación de una cuenta por ID - Éxito', async () => {
    const response = await request(app)
      .delete('/legalsystem/accounts/delete/19') 
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.deletedCount).toBe(1); 
  });

  
  afterAll(async () => {
    closeDBConnection();
  });
});
