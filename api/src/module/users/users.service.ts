import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from '../auth/services/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepository,
    private readonly encrypt: CryptoService,
  ) {}

  async create(dto: CreateUserDto): Promise<{ id: string }> {
    const passwordHash = await this.encrypt.hash(dto.password);

    const id = await this.repo.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      name: dto.name.trim(),
    });

    return { id };
  }

  async update(id: string, dto: UpdateUserDto): Promise<void> {
    const patch: Record<string, unknown> = {};

    if (dto.email !== undefined) patch.email = dto.email.toLowerCase().trim();
    if (dto.name !== undefined) patch.name = dto.name.trim();

    if (dto.password !== undefined) {
      patch.password = await this.encrypt.hash(dto.password);
    }

    const existsById = await this.repo.existsById(id);

    if (!existsById) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    await this.repo.updateById(id, patch as any);
  }

  async remove(id: string): Promise<void> {
    const existsById = await this.repo.existsById(id);

    if (!existsById) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    await this.repo.deleteById(id);
  }
}
