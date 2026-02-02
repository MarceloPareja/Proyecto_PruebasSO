const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

describe('Legal Advice API Tests', () => {
  let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
    authToken = await loginAndGetToken();
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener lista de consejos legales - Éxito (GET /adviceList)', async () => {
    const response = await request(app)
      .get('/legalsystem/adviceList');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba obtener consejo legal por ID - Éxito (GET /legalAdvice/:id)', async () => {
    const response = await request(app)
      .get('/legalsystem/legalAdvice/1'); // Ajusta ID real
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('adviceId');
  });

  it('Prueba crear nuevo consejo legal - Éxito (POST /legalAdvice)', async () => {
    const response = await request(app)
      .post('/legalsystem/legalAdvice')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        adviceId: 999, // ID de prueba
        topic: 'Test Topic',
        content: 'Test Content'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('adviceId');
  });

  it('Prueba actualizar consejo legal - Éxito (PUT /legalAdvice/:id)', async () => {
    const response = await request(app)
      .put('/legalsystem/legalAdvice/999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        topic: 'Updated Topic',
        content: 'Updated Content'
      });
    expect(response.statusCode).toBe(200);
  });

  it('Prueba generar texto vinculado - Éxito (GET /legalAdvice/:id/attachment)', async () => {
    const response = await request(app)
      .get('/legalsystem/legalAdvice/1/attachment')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ text: 'Test Text' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<a href');
  });
});