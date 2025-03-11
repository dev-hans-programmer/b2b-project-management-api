import app from './app';
import { config } from './config/app.config';
import connectDatabase from './config/db.config';
import { logger } from './config/logger.config';

app.listen(config.PORT, async () => {
   await connectDatabase();
   logger.info(
      `Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
   );
});
