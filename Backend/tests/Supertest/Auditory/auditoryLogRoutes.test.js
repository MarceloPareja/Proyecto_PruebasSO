const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

describe('Auditory Log API Tests', () => {
  let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
    authToken = await loginAndGetToken();
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener todos los logs - Éxito (GET /auditoryLogs)', async () => {
    const response = await request(app)
      .get('/legalsystem/auditoryLogs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba obtener log por ID - Éxito (GET /auditoryLog/:id)', async () => {
    const response = await request(app)
      .get('/legalsystem/auditoryLog/1'); // Ajusta ID
    expect(response.statusCode).toBe(200);
  });

  it('Prueba crear log - Éxito (POST /auditoryLog)', async () => {
    const response = await request(app)
      .post('/legalsystem/auditoryLog')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        auditoryLogId: 999,
        logAction: 'Test Action',
        accountId: 1,
        processId: 1
      });
    expect(response.statusCode).toBe(201);
  });

  it('Prueba actualizar log - Éxito (PUT /auditoryLog/:id)', async () => {
    const response = await request(app)
      .put('/legalsystem/auditoryLog/999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ logAction: 'Updated Action' });
    expect(response.statusCode).toBe(201); // Nota: tu ruta usa 201, ajusta si es 200
  });


});