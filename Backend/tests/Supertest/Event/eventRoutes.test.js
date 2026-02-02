const request = require('supertest');
const app = require('../../../app');
const path = require('path');
const fs = require('fs');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(60000);

describe('Evidence API Tests', () => {
  let authToken = '';
  let testEventId = null;
  let testEvidenceId = null;
  let testProcessId = null;

  beforeAll(async () => {
    await openDBConnection();
    authToken = await loginAndGetToken();

    // 1. Obtener un Process real para poder crear un Event
    const processRes = await request(app)
      .get('/legalsystem/processes')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (processRes.body.length > 0) {
      testProcessId = processRes.body[0].processId;
    } else {
      throw new Error("Se requiere al menos un proceso en la DB para ejecutar estos tests.");
    }

    // 2. Crear un Event de prueba vinculado a ese proceso
    const createEventRes = await request(app)
      .post('/legalsystem/event')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        processId: testProcessId,
        name: 'Event para Evidencia',
        description: 'Test Desc',
        dateStart: new Date(),
        dateEnd: new Date(),
        orderIndex: 1
      });
    
    testEventId = createEventRes.body.eventId;

    // 3. Crear una evidencia inicial para los tests de GET y PUT
    const createEvRes = await request(app)
      .post('/legalsystem/evidence')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        eventId: testEventId,
        evidenceName: 'Archivo Inicial',
        evidenceType: 'Documento',
        filePath: 'uploads/test-inicial.pdf'
      });
    testEvidenceId = createEvRes.body.evidenceId;
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba crear evidencia - Éxito (POST /evidence)', async () => {
    const response = await request(app)
      .post('/legalsystem/evidence')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        eventId: testEventId,
        evidenceName: 'Nueva Evidencia Test',
        evidenceType: 'Imagen',
        filePath: 'uploads/test-crear.png'
      });
    
    if (response.statusCode !== 201) {
        console.log("Error en POST /evidence:", response.body);
    }
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('evidenceId');
  });

  it('Prueba obtener evidencia por ID - Éxito (GET /evidence/:id)', async () => {
    const response = await request(app)
      .get(`/legalsystem/evidence/${testEvidenceId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.evidenceId).toBe(testEvidenceId);
  });

  it('Prueba actualizar evidencia - Éxito (PUT /evidence/:id)', async () => {
    const response = await request(app)
      .put(`/legalsystem/evidence/${testEvidenceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ evidenceName: 'Nombre Actualizado' });
    expect(response.statusCode).toBe(200);
    expect(response.body.evidenceName).toBe('Nombre Actualizado');
  });
});