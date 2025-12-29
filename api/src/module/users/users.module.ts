import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { CryptoService } from '../auth/services/crypto.service';
import { User, UserSchema } from './user.schema';
import { UploadService } from '../vehicles/services/upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UploadService, UsersService, UserRepository, CryptoService],
})
export class UsersModule {}
