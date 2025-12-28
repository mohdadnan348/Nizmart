const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

/* =======================
   DATABASE CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed', err);
    process.exit(1);
  });

/* =======================
   START SERVER
======================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =======================
   GRACEFUL SHUTDOWN
======================= */
process.on('SIGINT', async () => {
  console.log('🛑 Server shutting down...');
  await mongoose.connection.close();
  server.close(() => {
    process.exit(0);
  });
});
