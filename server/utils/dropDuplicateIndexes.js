const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 

const MONGODB_URI = process.env.MONGO_URI; 

const cleanupIndexes = async () => {
    try {
        console.log('🔗 Connecting to Global Network (MongoDB)...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connection established.');

        const db = mongoose.connection.db;

        console.log('--- USERS COLLECTION INDEXES ---');
        const userIndexes = await db.collection('users').indexes();
        console.group();
        userIndexes.forEach(index => console.log(`- ${index.name}`));
        console.groupEnd();
        
        console.log('--- HOSPITALS COLLECTION INDEXES ---');
        const hospitalIndexes = await db.collection('hospitals').indexes();
        console.group();
        hospitalIndexes.forEach(index => console.log(`- ${index.name}`));
        console.groupEnd();

        console.log('\n🗑️ Initiating targeted deletion of duplicate nested coordinates indexes...');
        
        try {
            await db.collection('users').dropIndex('location.coordinates_2dsphere');
            console.log('✅ Successfully dropped location.coordinates_2dsphere on Users.');
        } catch (e) {
            console.log('⚠️ location.coordinates_2dsphere not found or already dropped on Users.');
        }

        try {
            await db.collection('hospitals').dropIndex('location.coordinates_2dsphere');
            console.log('✅ Successfully dropped location.coordinates_2dsphere on Hospitals.');
        } catch (e) {
            console.log('⚠️ location.coordinates_2dsphere not found or already dropped on Hospitals.');
        }

        console.log('🚀 Geospatial Indexing Ambiguity Resolved. Network is stabilized.');

    } catch (error) {
        console.error('❌ CRITICAL ERROR mapping geospatial indexes:', error);
    } finally {
        console.log('🔌 Disconnecting from MongoDB...');
        await mongoose.disconnect();
        process.exit(0);
    }
};

cleanupIndexes();
