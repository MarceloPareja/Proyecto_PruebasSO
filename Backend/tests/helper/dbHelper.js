const request = require('supertest');
const app = require('../../app'); 

const mongoose = require('mongoose');

const openDBConnection = async () => {
  await mongoose.connect(process.env.MONGODB_URI,);
};

const closeDBConnection = async () => {
    await mongoose.connection.close();
};

module.exports = {
  openDBConnection,
  closeDBConnection
};


