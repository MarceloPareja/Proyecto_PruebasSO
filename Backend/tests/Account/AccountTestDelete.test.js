const request = require('supertest');
const app = require('../../app'); 
const mongoose = require('mongoose');
const { loginAndGetToken } = require('../helper/loginhelper');

describe('Account API Tests Delete', () => {
let authToken = '';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
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
    await mongoose.connection.close();
  });
});