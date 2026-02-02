const request = require('supertest');
const app = require('../../../app');
const { loginAndGetToken } = require('../helper/loginhelper');
const { openDBConnection, closeDBConnection } = require('../helper/dbHelper');

jest.setTimeout(30000); // Timeout global para evitar exceder 5000ms

let authToken = '';

beforeAll(async () => {
  await openDBConnection();

  // Login con retries
  let retries = 3;
  while (retries > 0) {
    try {
      authToken = await loginAndGetToken();
      console.log('Login exitoso en retry', 4 - retries);
      break;
    } catch (err) {
      retries--;
      console.error('Login retry falló:', err.message);
      await new Promise(r => setTimeout(r, 2000)); // Espera 2s
    }
  }
  if (!authToken) throw new Error('Login falló después de 3 intentos');
});

afterAll(async () => {
  await closeDBConnection();
});

// Tests de GET
describe('Account API Tests GET', () => {
  it('Prueba de obtencion de todas las cuentas - Exito', async () => {
    const response = await request(app)
      .get('/legalsystem/accounts')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba de obtención una cuenta por ID ', async () => {
    const response = await request(app)
      .get('/legalsystem/account/25') // ID real de tu DB (testinguser)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body).toHaveProperty('accountId', 25);
  });
});

// Tests de POST
describe('Account API Tests Post', () => {
  it('Prueba de creacion de una nueva cuenta - Éxito', async () => {
    const uniqueEmail = `newaccount_${Date.now()}@example.com`; // Evita duplicado
    const response = await request(app)
      .post('/legalsystem/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'testAccount',
        lastname: 'testLastName',
        phoneNumber: '1234567890',
        email: uniqueEmail,
        password: 'p1234' // Requerido para bcrypt
      });
    expect(response.statusCode).toBe(201);
  });
});

// Tests de PUT
describe('Account API Tests Put', () => {
  let testAccountId = null;

  beforeAll(async () => {
    const uniqueEmail = `testput_${Date.now()}@example.com`;
    const createRes = await request(app)
      .post('/legalsystem/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Put',
        lastname: 'User',
        phoneNumber: '0999999999',
        email: uniqueEmail,
        password: 'p1234'
      });

    if (createRes.status !== 201) {
      throw new Error('Creación falló: ' + createRes.text);
    }

    testAccountId = createRes.body.accountId;
    console.log('Cuenta creada con ID:', testAccountId);
  });

  it('Prueba aactualizacion de una cuenta por ID - Exito', async () => {
    const uniqueUpdatedEmail = `updated_${Date.now()}@example.com`; // Evita unique conflict
    const response = await request(app)
      .put(`/legalsystem/accounts/update/${testAccountId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'UpdatedName',
        lastname: 'UpdatedLastName',
        phoneNumber: '0987654321',
        email: uniqueUpdatedEmail,
        password: 'updatedp1234' // Requerido si update toca password
      });
    expect(response.statusCode).toBe(200);
  });
});
