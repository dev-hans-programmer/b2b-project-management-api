import app from './app';
import { config } from './config/app.config';
import connectDatabase from './config/db.config';

app.listen(config.PORT, async () => {
   // await connectDatabase();
   console.log(
      `Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
   );
});
