const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000); // 60 segundos para evitar timeout en login

describe('Process API Tests', () => {
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

  it('Prueba obtener todos los procesos - Éxito (GET /processes)', async () => {
    const response = await request(app)
      .get('/legalsystem/processes');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba crear proceso - Éxito (POST /process)', async () => {
    const uniqueProcessNumber = `PROC-TEST-${Date.now()}`; // Evita duplicados si hay validación única
    const response = await request(app)
      .post('/legalsystem/process')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId: 1,                    // Quemado como pediste
        title: 'Proceso de prueba para tests',
        processType: 'civil',
        offense: 'violencia domestica',
        province: 'Tungurahua',
        canton: 'Ambato',
        clientGender: 'femenino',
        clientAge: 30,
        processStatus: 'activo',
        processNumber: uniqueProcessNumber,
        processDescription: 'Descripción larga de prueba para el test',
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-12-31T23:59:59.000Z'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('processId'); // Verifica que devuelve processId autoincremental
  });

  it('Prueba actualizar proceso - Éxito (PUT /process/update/:id)', async () => {
    const existingProcessId = 35; // ← Quemado: processId real de tu base de datos

    const response = await request(app)
      .put(`/legalsystem/process/${existingProcessId}/update`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Título Actualizado para tests',
        processDescription: 'Descripción actualizada desde el test',
        processStatus: 'en progreso'
      });

    expect(response.statusCode).toBe(200);
  });
});