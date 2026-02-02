const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000); // 60 segundos para evitar timeout en login

describe('Reminder API Tests', () => {
  let authToken = '';

  beforeAll(async () => {
    await openDBConnection();

    // Login con retries
    let retries = 10;
    while (retries > 0) {
      try {
        authToken = await loginAndGetToken();
        console.log('Login exitoso en retry', 11 - retries);
        break;
      } catch (err) {
        retries--;
        console.error('Login retry falló (restan', retries, '):', err.message);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    if (!authToken) {
      throw new Error('Login falló después de 10 intentos');
    }
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener todos los recordatorios - Éxito (GET /reminders)', async () => {
    const response = await request(app)
      .get('/legalsystem/reminders');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba crear recordatorio - Éxito (POST /reminder)', async () => {
    const uniqueTitle = `Test Reminder ${Date.now()}`; // Para evitar duplicados si hay validación
    const response = await request(app)
      .post('/legalsystem/reminder')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: uniqueTitle,
        dateTime: '2026-02-01T10:00:00.000Z',
        activeFlag: true,
        appointmentId: 1 // Uno de los reales que tienes
      });
    expect(response.statusCode).toBe(201);
  });

  it('Prueba actualizar recordatorio - Éxito (PUT /reminder/:id)', async () => {
    const existingReminderId = 4; // ← Quemado: uno real de tu screenshot ("Cita en la corte mañana")

    const response = await request(app)
      .put(`/legalsystem/reminder/${existingReminderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Título Actualizado para tests',
        dateTime: '2026-03-01T10:00:00.000Z',
        activeFlag: false
      });

    expect(response.statusCode).toBe(200);
  });
});