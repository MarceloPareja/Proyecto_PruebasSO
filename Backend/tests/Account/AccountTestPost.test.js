const request = require('supertest');
const app = require('../../server'); 
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');
describe('Account API Tests Post', () => {
let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
  });

  it('Prueba de creacion de una nueva cuenta - Éxito', async () => {
    const response = await request(app)
      .post('/legalsystem/account') 
      .set('Authorization', `Bearer ${authToken}`)
      .send({
            name: 'testAccount',
            lastname: 'testLastName',
            phoneNumber: '1234567890',
            email: 'newaccount@example.com'
        });
    expect(response.statusCode).toBe(201);
  });
  
  afterAll(async () => {
    closeDBConnection();
  });

  
});