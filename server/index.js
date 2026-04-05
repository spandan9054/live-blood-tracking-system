require('dotenv').config(); // 1. Environment variables at absolute top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middleware setup before route definitions
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

app.get('/', (req, res) => {
  res.send('SBAN API is running...');
});

app.get('/api/health', (req, res) => {
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const status = mongoose.connection.readyState;
    res.json({ 
        database_status: status, 
        message: status === 1 ? 'Network Node Connected' : 'Network Communication Failure' 
    });
});

// 2. Robust Database Connection
const connectDB = async () => {
    try {
        // Prevent Mongoose 7+ deprecation warnings
        mongoose.set('strictQuery', false);
        
        // --- CRITICAL FIX: Disable Buffering ---
        // Throws immediate error if not connected instead of waiting 10s and crashing countDocuments()
        mongoose.set('bufferCommands', false);

        // Add Connection Event Listeners
        mongoose.connection.on('connected', () => console.log('🟢 MongoDB Event: Active Node Topology Established'));
        mongoose.connection.on('error', (err) => console.log('🔴 MongoDB Event: Node Desynchronization Error', err));

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
            serverSelectionTimeoutMS: 5000, // Fail fast if IP is blocked
            family: 4, // Force IPv4 to resolve local network routing bugs
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

        // --- CRITICAL FIX: Explicitly Build 2dsphere Indexes ---
        // Forces MongoDB to map the required grid indexes for the $geoNear Hacktropica math.
        console.log('Syncing planetary matrix indexes...');
        const User = require('./models/User');
        await Hospital.syncIndexes();
        await User.syncIndexes();
        console.log('✅ 2dsphere Geolocation Matrix active.');

        // 3. Server Initialization Logic: Only listen if DB connects
        app.listen(PORT, () => {
            console.log(`🚀 SBAN Terminal initialized on port ${PORT}`);
            console.log(`🔗 Interface available at http://localhost:${PORT}`);
        });

    } catch (err) {
        // Log exact error and kill process
        console.error('❌ CRITICAL NODE CRASH:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('❌ DATABASE BLOCKED: Check your MongoDB Atlas IP Whitelist (0.0.0.0/0)!');
        }
        process.exit(1); 
    }
};

// Fire initiation
connectDB();
