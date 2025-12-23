import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthRepository } from './auth.repository';
import { EndSessionDto } from './dto/end-session.dto';
import { UserRepository } from '../users/users.repository';
import { StartSessionDto } from './dto/start-session.dto';
import { CryptoService } from './services/crypto.service';
import { ConfigService } from '@nestjs/config';
import { StartSessionOutput } from './auth.type';

@Injectable()
export class AuthService {
  private readonly accessTtlSeconds = 60 * 15;
  private readonly refreshTtlSeconds = 60 * 60 * 24 * 30;
  private readonly jwtSecret: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly authRepo: AuthRepository,
    private readonly userRepo: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly config: ConfigService,
  ) {
    const jwtSecret = this.config.get('JWT_ACCESS_SECRET');

    if (!jwtSecret) throw new NotFoundException('JWT secret not found');

    this.jwtSecret = jwtSecret;
  }

  async startSession(input: StartSessionDto): Promise<StartSessionOutput> {
    const email = (input.email ?? '').trim().toLowerCase();
    const user = await this.userRepo.findOneByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = String(user._id);

    const accessToken = await this.signAccessToken(userId, email);

    const expiresAt = new Date(Date.now() + this.refreshTtlSeconds * 1000);
    await this.authRepo.create({
      userId: new Types.ObjectId(userId),
      expiresAt,
    });

    return { userId, expiresAt, accessToken };
  }

  async endSession(dto: EndSessionDto): Promise<void> {
    const currentSession = await this.authRepo.findOneById(dto.sessionId);
    if (!currentSession) {
      throw new NotFoundException('Não há sessoes ativas para encerrar');
    }

    await this.authRepo.endSession(dto.sessionId);
  }

  private async signAccessToken(
    userId: string,
    email?: string,
  ): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, email },
      {
        expiresIn: this.accessTtlSeconds,
        secret: this.jwtSecret,
      },
    );
  }

  private async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return this.cryptoService.compare(plain, hash);
  }
}
