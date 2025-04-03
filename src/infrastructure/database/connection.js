import { set, connect } from 'mongoose';

set('strictQuery', true);

const MONGO_URI = `mongodb+srv://Backend:0VYyi8776OlO6ps3@clusterdev.v10d7k7.mongodb.net/Users?retryWrites=true&w=majority`;

/**
 * Method to connect server to the database.
 */
export const connectToDatabase = async () => {
	try {
		const db = await connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 10000, 
		});
		console.log('✅ Database connected:', db.connection.host);
	} catch (error) {
		console.error('❌ Connection failed:', error.message);
		process.exit(1); 
	}
};
