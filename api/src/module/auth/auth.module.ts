import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { Session, SessionSchema } from './auth.schema';
import { CryptoService } from './services/crypto.service';
import { User, UserSchema } from '../users/user.schema';
import { UserRepository } from '../users/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    CryptoService,
    AuthService,
    UserRepository,
    AuthRepository,
  ],
})
export class AuthModule {}
