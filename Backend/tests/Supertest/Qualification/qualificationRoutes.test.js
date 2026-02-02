const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

describe('Qualification API Tests', () => {
  let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
    authToken = await loginAndGetToken();
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener todas las calificaciones - Éxito (GET /qualifications)', async () => {
    const response = await request(app)
      .get('/legalsystem/qualifications');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba obtener calificación por ID - Éxito (GET /qualification/:id)', async () => {
    const response = await request(app)
      .get('/legalsystem/qualification/1'); // Ajusta ID
    expect(response.statusCode).toBe(200);
  });

  it('Prueba crear calificación - Éxito (POST /qualification)', async () => {
    const response = await request(app)
      .post('/legalsystem/qualification')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        qualificationId: 999,
        role: 'Test Role',
        institution: 'Test Inst',
        place: 'Test Place',
        startYear: 2020,
        endYear: 2023,
        qualificationType: 'Degree',
        profileId: 1
      });
    expect(response.statusCode).toBe(201);
  });

  it('Prueba actualizar calificación - Éxito (PUT /qualification/update/:id)', async () => {
    const response = await request(app)
      .put('/legalsystem/qualification/update/999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ role: 'Updated Role' });
    expect(response.statusCode).toBe(200);
  });

});