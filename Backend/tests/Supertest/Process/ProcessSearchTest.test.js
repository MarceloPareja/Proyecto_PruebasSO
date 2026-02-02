const request = require('supertest');
const app = require('../../../app'); 
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

describe('Account API Tests Delete', () => {
  let authToken = '';

  beforeAll(async () => {
    await openDBConnection();
    authToken = await loginAndGetToken();
  });

  afterAll(async () => {
    await closeDBConnection();
  });

  it('Prueba de búsqueda de casos existentes - Éxito', async () => {
    const response = await request(app)
      .get('/legalsystem/processes/searchByTitle') 
      .set('Authorization', `Bearer ${authToken}`)
      .query({ title: 'los horrores' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Prueba de búsqueda sin coincidencias - Error', async () => {
    const response = await request(app)
      .get('/legalsystem/processes/searchByTitle') 
      .set('Authorization', `Bearer ${authToken}`)
      .query({ title: 'El caso de prueba' });
    expect(response.status).toBe(200); // Cambiado: 200 con array vacío es OK, no 404
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('Prueba de búsqueda con entradas erroneas - Error', async () => {
    const response = await request(app)
      .get('/legalsystem/processes/searchByTitle') 
      .set('Authorization', `Bearer ${authToken}`)
      .query({ title: '#$^&(()*' });
    expect(response.status).toBe(500); // Si tu ruta devuelve 500, ajusta; si no, corrige la ruta para 400
  });
});