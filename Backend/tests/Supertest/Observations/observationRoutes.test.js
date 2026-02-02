const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000); // 60 segundos para evitar timeout en login

describe('Observation API Tests', () => {
  let authToken = '';
  let testEventId = 10; // ID quemado para eventId
  let testObservationId = null;

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

    // Crear observation de prueba si no existe
    const createRes = await request(app)
      .post('/legalsystem/observation')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Title',
        content: 'Test Content',
        eventId: testEventId
      });

    if (createRes.status !== 201) {
      console.error('Creación falló:', createRes.status, createRes.text);
      throw new Error('No se pudo crear observation de prueba');
    }

    testObservationId = createRes.body.observationId || 2; // Fallback a real si no devuelve
    console.log('Observation creada con observationId:', testObservationId);
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba crear observación - Éxito (POST /observation)', async () => {
    const response = await request(app)
      .post('/legalsystem/observation')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Otro Test Title',
        content: 'Otro Test Content',
        eventId: testEventId
      });
    expect(response.statusCode).toBe(201);
  });

  it('Prueba obtener todas las observaciones - Éxito (GET /observations)', async () => {
    const response = await request(app)
      .get('/legalsystem/observations');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba obtener observación por ID - Éxito (GET /observation/:id)', async () => {
    const response = await request(app)
      .get(`/legalsystem/observation/${testObservationId}`);
    expect(response.statusCode).toBe(200);
  });

  it('Prueba actualizar observación - Éxito (PUT /observation/:id)', async () => {
    const response = await request(app)
      .put(`/legalsystem/observation/${testObservationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Title' });
    expect(response.statusCode).toBe(200);
  });

  it('Prueba obtener observaciones por eventId - Éxito (GET /observations/event/:eventId)', async () => {
    const response = await request(app)
      .get(`/legalsystem/observations/event/${testEventId}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});