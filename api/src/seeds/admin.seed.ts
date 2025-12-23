import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/module/users/user.schema';
import { UserRole } from 'src/module/users/users.type';
import { CryptoService } from 'src/module/auth/services/crypto.service';

@Injectable()
export class AdminSeed {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    private readonly config: ConfigService,
    private readonly bcrypt: CryptoService,
  ) {}

  async run(): Promise<void> {
    const name = this.config.get<string>('ADMIN_NAME');
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.warn(
        'ADMIN_EMAIL / ADMIN_PASSWORD not set. Skipping admin seed.',
      );
      return;
    }

    const existing = await this.users.findOne({ email }).lean();
    if (existing) {
      if ((existing as any).role !== UserRole.ADMIN) {
        await this.users.updateOne(
          { email },
          { $set: { role: UserRole.ADMIN } },
        );
        this.logger.log(
          `Admin user already existed; role updated to ADMIN: ${email}`,
        );
      } else {
        this.logger.log(`Admin user already exists: ${email}`);
      }
      return;
    }

    const passwordHash = await this.bcrypt.hash(password);

    await this.users.create({
      name,
      email,
      passwordHash,
      roles: [UserRole.ADMIN],
    });

    this.logger.log(`Admin user created: ${email}`);
  }
}
