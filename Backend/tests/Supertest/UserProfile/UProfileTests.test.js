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
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  if (!authToken) throw new Error('Login falló después de 3 intentos');
});

afterAll(async () => {
  await closeDBConnection();
});

// Tests de GET
describe('Profile API Tests GET', () => {
  it('Prueba obtener todos los perfiles - Éxito', async () => {
    const response = await request(app)
      .get('/legalsystem/profiles')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Prueba obtener perfil por ID - Éxito', async () => {
    const response = await request(app)
      .get('/legalsystem/profile/3') // ID real de tu DB
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('profileId', 3);
  });
});

// Tests de POST
describe('Profile API Tests POST', () => {
  it('Prueba crear un perfil de usuarios - Éxito', async () => {
    const response = await request(app)
      .post('/legalsystem/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        profileId: 999, // ID único que no exista
        title: 'Test Title',
        bio: 'This is a test bio',
        address: '123 Test St',
        profilePicture: '../Assets/mickey.jpg',
        accountId: 25 // ID real de tu usuario de pruebas
      });
    expect(response.statusCode).toBe(201);
  });
});

// Tests de PUT
describe('Profile API Tests PUT', () => {
  let testProfileId = null;

  beforeAll(async () => {
    // Crear perfil de prueba
    const createRes = await request(app)
      .post('/legalsystem/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        profileId: 998, // ID único
        title: 'Test Put Title',
        bio: 'Test bio',
        address: 'Test Address',
        profilePicture: '../Assets/mickey.jpg',
        accountId: 25
      });

    if (createRes.status !== 201) {
      throw new Error('Creación de perfil falló: ' + createRes.text);
    }

    testProfileId = createRes.body.profileId || 998; // Ajusta según respuesta
    console.log('Perfil creado con ID:', testProfileId);
  });

  it('Prueba actualizar un perfil de usuarios - Éxito', async () => {
    const response = await request(app)
      .put(`/legalsystem/profile/update/${testProfileId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Test Title',
        bio: 'This is an updated test bio',
        address: '456 Updated St',
        profilePicture: '../Assets/mickey.jpg',
        accountId: 25
      });
    expect(response.statusCode).toBe(200);
  });
});
