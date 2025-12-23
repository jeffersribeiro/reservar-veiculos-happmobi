import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './module/auth/auth.module';
import { VehiclesModule } from './module/vehicles/vehicles.module';
import { ReservationsModule } from './module/reservations/reservations.module';
import { UsersModule } from './module/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './module/auth/guards/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AdminSeed } from './seeds/admin.seed';
import { User, UserSchema } from './module/users/user.schema';
import { CryptoService } from './module/auth/services/crypto.service';
import { VehicleSeed } from './seeds/vehicles.seed';
import { Vehicle, VehicleSchema } from './module/vehicles/vehicle.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get('MONGO_URI', { infer: true });

        return {
          uri,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    VehiclesModule,
    ReservationsModule,
  ],
  providers: [
    AdminSeed,
    VehicleSeed,

    JwtService,
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
