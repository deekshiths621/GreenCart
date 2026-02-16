import mongoose from 'mongoose';
import 'dotenv/config';

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.set('debug', true);

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database Connected Successfully!');
    console.log('Connected to:', mongoose.connection.name);
    process.exit(0);
} catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}
