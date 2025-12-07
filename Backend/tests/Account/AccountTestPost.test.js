const request = require('supertest');
const app = require('../../app'); 
const { loginAndGetToken } = require('../helper/loginhelper');
describe('Account API Tests Post', () => {
let authToken = '';

  beforeAll(async () => {
   authToken = await loginAndGetToken();
  });

  
});