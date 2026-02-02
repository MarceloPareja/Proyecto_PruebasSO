const mongoose = require('mongoose');

let isConnected = false;

const openDBConnection = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI no definida');

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 30000,
    bufferTimeoutMS: 30000  
  });

  await mongoose.connection.asPromise();

  await mongoose.connection.db.admin().ping();

  isConnected = true;
  console.log('MongoDB conexión establecida y lista (ping OK)');
};

const closeDBConnection = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB desconectado');
  }
};

module.exports = { openDBConnection, closeDBConnection };