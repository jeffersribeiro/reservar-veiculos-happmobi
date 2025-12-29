import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from '../auth/services/crypto.service';
import { UploadService } from '../vehicles/services/upload.service';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepository,
    private readonly encrypt: CryptoService,
    private readonly uploadService: UploadService,
  ) {}

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.repo.findOneById(userId);

    if (!user) throw new NotFoundException('User not fould');

    return user;
  }

  async create(
    dto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<{ id: string }> {
    const userAlreadyExists = await this.repo.findOneByEmailWithPassword(
      dto.email,
    );

    if (userAlreadyExists) throw new ConflictException('User already exists');

    const passwordHash = await this.encrypt.hash(dto.password);

    const uploadResult = await this.uploadService.save(file);

    const avatarPhotoUrl = uploadResult.url;

    const id = await this.repo.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      avatarPhotoUrl,
      name: dto.name.trim(),
    });

    return { id };
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const patch: Record<string, unknown> = {};

    if (dto.email !== undefined) patch.email = dto.email.toLowerCase().trim();
    if (dto.name !== undefined) patch.name = dto.name.trim();

    const existsById = await this.repo.existsById(id);

    if (!existsById) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    const uploadResult = await this.uploadService.save(file);

    const avatarPhotoUrl = uploadResult.url;

    await this.repo.updateById(id, {
      ...patch,
      avatarPhotoUrl,
    });
  }

  async remove(id: string): Promise<void> {
    const existsById = await this.repo.existsById(id);

    if (!existsById) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    await this.repo.deleteById(id);
  }
}
