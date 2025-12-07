const request = require('supertest');
const app = require('../../app'); 
const path = require('path');
const { loginAndGetToken } = require('../helper/loginhelper');

describe('Profile API Tests Post', () => {
let authToken = '';

  beforeAll(async () => {
    authToken = await loginAndGetToken();
  });

  it('Prueba crear un perfil de usuarios - Exito', async () => {
    const response = await request(app)
        .post('/profile')
        .send({
          profileId: '2',
          title: 'Test Title',
            bio: 'This is a test bio',
            address: '123 Test St',
            profilePicture: '../Assets/mickey.jpg',
            accountId: '1'
        })
        .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);  
    });

  it('Prueba subir Imagen por ID - Exito', async () => {
    const imagePath = path.join(__dirname, '../Assets/mickey.jpg');
    const response = await request(app)
      .post('/profile/uploadImage/2')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('profilePicture', imagePath);
    expect(response.statusCode).toBe(200);  
    
});

});