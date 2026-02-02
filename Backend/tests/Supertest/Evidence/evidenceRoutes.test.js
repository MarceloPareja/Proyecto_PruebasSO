const request = require('supertest');
const app = require('../../../app');
const path = require('path');
const fs = require('fs');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000);

describe('Evidence API Tests', () => {
  let authToken = '';
  let testProcessId = null;
  let testEventId = null;
  let testEvidenceId = null;

  beforeAll(async () => {
    await openDBConnection();

    // --- LÓGICA DE REINTENTOS PARA LOGIN ---
    let retries = 3;
    while (retries > 0) {
      try {
        authToken = await loginAndGetToken();
        console.log('Login exitoso en retry', 4 - retries);
        break;
      } catch (err) {
        retries--;
        console.error('Login retry falló:', err.message);
        if (retries === 0) throw new Error('Login falló después de 3 intentos');
        await new Promise(r => setTimeout(r, 2000)); // Espera 2s
      }
    }

    // --- PREPARACIÓN DE DATOS JERÁRQUICOS ---

    // 1. Crear un Proceso (Requerido por el validador de Event.js)
    const processRes = await request(app)
      .post('/legalsystem/process')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Proceso de Test Evidencia',
        accountId: 1,
        processStatus: 'not started'
      });
    testProcessId = processRes.body.processId;

    // 2. Crear un Evento vinculado al proceso
    const eventRes = await request(app)
      .post('/legalsystem/event')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        processId: testProcessId,
        name: 'Evento de Prueba',
        orderIndex: 1,
        dateStart: new Date()
      });
    testEventId = eventRes.body.eventId;

    // 3. Crear evidencia inicial para tests de consulta
    const evidenceRes = await request(app)
      .post('/legalsystem/evidence')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        eventId: testEventId,
        evidenceName: 'Evidencia Inicial',
        evidenceType: 'PDF',
        filePath: 'uploads/inicial.pdf'
      });
    testEvidenceId = evidenceRes.body.evidenceId;
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba obtener evidencia por ID - Éxito (GET /evidence/:id)', async () => {
    const response = await request(app)
      .get(`/legalsystem/evidence/0`);
    expect(response.statusCode).toBe(200);
  });


});