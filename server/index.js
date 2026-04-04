require('dotenv').config(); // 1. Environment variables at absolute top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middleware setup before route definitions
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));credentials: true
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

app.get('/', (req, res) => {
  res.send('SBAN API is running...');
});

// 2. Robust Database Connection
const connectDB = async () => {
    try {
        // Prevent Mongoose 7+ deprecation warnings
        mongoose.set('strictQuery', false);

        const mongoUri = process.env.MONGO_URI;

        // DEBUG: Verify environment variable loading
        console.log('-------------------------------------------');
        console.log('DEBUG: Checking Identity Environment Vector...');
        if (!mongoUri) {
            console.error('❌ CRITICAL ERROR: MONGO_URI is UNDEFINED in .env file!');
            console.error('ACTION REQUIRED: Check your .env file in the /server directory.');
            throw new Error('Identity Vector Missing: MONGO_URI');
        } else {
            console.log('✅ Identity Vector (MONGO_URI) loaded successfully.');
        }
        console.log('-------------------------------------------');

        console.log('Connecting to Global Network (MongoDB)...');
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000, // 10s timeout, avoid infinite hang
        });

        console.log(`📡 Network Node Active: ${conn.connection.host}`);
        
        // Automated Seeding check
        const Hospital = require('./models/Hospital');
        const count = await Hospital.countDocuments();
        if (count === 0) {
            console.log('Seeding initial hospital nodes...');
            const { hospitals } = require('./seeders/demoData');
            await Hospital.insertMany(hospitals);
            console.log('Seeding complete.');
        }

        // 3. Server Initialization Logic: Only listen if DB connects
        app.listen(PORT, () => {
            console.log(`🚀 SBAN Terminal initialized on port ${PORT}`);
            console.log(`🔗 Interface available at http://localhost:${PORT}`);
        });

    } catch (err) {
        // Log exact error and kill process
        console.error('❌ CRITICAL NODE CRASH:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('CHECK: Is your MongoDB service running? (mongod)');
        }
        process.exit(1); 
    }
};

// Fire initiation
connectDB();
