import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly saltRounds: number;
  private readonly hashEncrypt: string;

  constructor(private readonly config: ConfigService) {
    const raw = this.config.get<string>('BCRYPT_SALT_ROUNDS', '12');
    this.hashEncrypt = this.config.get<string>('HASH_ENCRYPT', '12');
    const parsed = Number(raw);

    if (!Number.isInteger(parsed) || parsed < 4 || parsed > 20) {
      throw new Error(
        `Invalid BCRYPT_SALT_ROUNDS="${raw}". Use an integer between 4 and 20.`,
      );
    }

    this.saltRounds = parsed;
  }

  async hash(plain: string): Promise<string> {
    if (!plain || typeof plain !== 'string') {
      throw new TypeError('hash(): "plain" must be a non-empty string');
    }
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    if (!plain || typeof plain !== 'string') {
      throw new TypeError('compare(): "plain" must be a non-empty string');
    }
    if (!hash || typeof hash !== 'string') {
      throw new TypeError('compare(): "hash" must be a non-empty string');
    }
    return bcrypt.compare(plain, hash);
  }

  async safeCompare(
    plain: string,
    hashOrNull?: string | null,
  ): Promise<boolean> {
    const hash = hashOrNull ?? this.hashEncrypt;
    return bcrypt.compare(plain, hash);
  }
}
