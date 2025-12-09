const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

// Add event listeners
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔴 Mongoose disconnected');
});

module.exports = connectDB;