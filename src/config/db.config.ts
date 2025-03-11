import mongoose from 'mongoose';
import { config } from './app.config';
import { logger } from './logger.config';

const connectDatabase = async () => {
   try {
      const conn = await mongoose.connect(config.MONGO_URI);
      logger.info(`MongoDB connected: ${conn.connection.host}`);
   } catch (err) {
      const error = err as Error;
      logger.error(`Mongo connection Error: ${error.message}`);
      process.exit(1);
   }
};

export default connectDatabase;
