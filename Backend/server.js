require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
// Conexión a MongoDB y arranque del servidor
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la base de datos MongoDB Atlas");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectarse a la base de datos", err);
  }
}

startServer();