import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminSeed } from './seeds/admin.seed';
import { VehicleSeed } from './seeds/vehicles.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeds = [AdminSeed, VehicleSeed];

  for (const seed of seeds) {
    const adminSeed = app.get(seed);
    await adminSeed.run();
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
