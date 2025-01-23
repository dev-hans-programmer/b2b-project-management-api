import mongoose from 'mongoose';
import { config } from './app.config';

const connectDatabase = async () => {
   try {
      const conn = await mongoose.connect(config.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
   } catch (err) {
      const error = err as Error;
      console.error(`Mongo connection Error: ${error.message}`);
      process.exit(1);
   }
};

export default connectDatabase;
