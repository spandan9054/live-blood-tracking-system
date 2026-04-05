const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 

const MONGODB_URI = process.env.MONGO_URI; 

const createIndexes = async () => {
    try {
        console.log('🔗 Connecting to Global Network (MongoDB)...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connection established.');

        const db = mongoose.connection.db;

        console.log('⚙️ Initiating 2dsphere Indexing Protocol on Hospitals and Users collections...');
        
        // Target specifically the hospitals collection
        const hospitalIndexResult = await db.collection('hospitals').createIndex({ location: "2dsphere" });
        console.log(`✅ Hospitals collection index created/verified: ${hospitalIndexResult}`);

        // Target the users collection for geofencing as well
        const userIndexResult = await db.collection('users').createIndex({ location: "2dsphere" });
        console.log(`✅ Users collection index created/verified: ${userIndexResult}`);

        console.log('🚀 Geospatial Indexing Complete. Network is now ready for $geoNear Transmissions.');

    } catch (error) {
        console.error('❌ CRITICAL ERROR mapping geospatial indexes:', error);
    } finally {
        console.log('🔌 Disconnecting from MongoDB...');
        await mongoose.disconnect();
        process.exit(0);
    }
};

createIndexes();
