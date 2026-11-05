const mongoose = require('mongoose');

const dbState = {
  isConnected: false,
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sindh_stream_warning'
};

async function connectDB() {
  try {
    console.log(`[Database] Attempting connection to MongoDB: ${dbState.uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    
    // Set a 3-second selection timeout so startup never hangs if local MongoDB daemon isn't running
    const conn = await mongoose.connect(dbState.uri, {
      serverSelectionTimeoutMS: 3000
    });

    dbState.isConnected = true;
    console.log(`[Database] ✅ Connected to MongoDB host: ${conn.connection.host} / DB: ${conn.connection.name}`);
  } catch (error) {
    dbState.isConnected = false;
    console.warn(`[Database] ⚠️ MongoDB connection skipped: ${error.message}`);
    console.warn(`[Database] ℹ️ Operating in High-Availability In-Memory / File-Cached Mode.`);
    console.warn(`[Database] ℹ️ To use MongoDB, start mongod locally or paste your MongoDB Atlas URI into server/.env`);
  }
}

module.exports = { connectDB, dbState };
