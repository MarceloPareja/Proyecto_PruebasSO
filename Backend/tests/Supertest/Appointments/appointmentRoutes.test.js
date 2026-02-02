const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000); // ← Subí a 60s

describe('Appointment API Tests', () => {
  let authToken = '';
  let testAppointmentId = 3;

  beforeAll(async () => {
    await openDBConnection();

    // Login con más retries
    let retries = 10;
    while (retries > 0) {
      try {
        authToken = await loginAndGetToken();
        console.log('Login exitoso en retry', 11 - retries);
        break;
      } catch (err) {
        retries--;
        console.error('Login retry falló (restan', retries, '):', err.message);
        await new Promise(r => setTimeout(r, 3000)); // Espera 3s
      }
    }
    if (!authToken) {
      throw new Error('Login falló después de 10 intentos');
    }

    // Crear cita de prueba
    const uniqueType = `Test Appointment ${Date.now()}`;
    const createRes = await request(app)
      .post('/legalsystem/appointment')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: uniqueType,
        date: '2026-02-01T10:00:00.000Z',
        description: 'Cita de prueba para tests',
        contactInfo: 'test@example.com',
        accountId: 25 // ID real
      });

    if (createRes.status !== 201) {
      console.error('Creación falla:', createRes.status, createRes.text);
      throw new Error('No se pudo crear cita');
    }
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener citas por accountId - Éxito (GET /account/:accountId/appointments)', async () => {
    const response = await request(app)
      .get('/legalsystem/account/25/appointments') // Usa accountId real
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba crear cita - Éxito (POST /appointment)', async () => {
    const response = await request(app)
      .post('/legalsystem/appointment')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'Meeting Test',
        date: '2026-02-01T10:00:00.000Z',
        description: 'Otra cita de prueba',
        contactInfo: 'test2@example.com',
        accountId: 25
      });
    expect(response.statusCode).toBe(201);
  });

  it('Prueba actualizar cita - Éxito (PUT /appointment/:id)', async () => {
    const response = await request(app)
      .put(`/legalsystem/appointment/${testAppointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'Descripción actualizada' });
    expect(response.statusCode).toBe(200);
  });


  it('Prueba crear recordatorio para cita - Éxito (POST /appointment/:id/reminder)', async () => {
    const response = await request(app)
      .post(`/legalsystem/appointment/${testAppointmentId}/reminder`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ daysBefore: 2, title: 'Recordatorio de prueba' });
    expect(response.statusCode).toBe(201);
  });
});