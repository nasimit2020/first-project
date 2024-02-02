import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();



process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log(`unhandledRejection is detected, shutting down...`);

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1);
})


process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1)
})
