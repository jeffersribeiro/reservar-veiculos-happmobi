import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './user.schema';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,
  ) {}

  async findOneByEmailWithPassword(
    email: string,
  ): Promise<UserDocument | null> {
    return this.users
      .findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .exec();
  }

  async create(input: Partial<User>): Promise<string> {
    const doc = await this.users.create(input);
    return String(doc._id);
  }

  async updateById(id: string, input: Partial<User>): Promise<void> {
    await this.users.updateOne({ _id: id }, { $set: input });
  }

  async deleteById(id: string): Promise<void> {
    await this.users.deleteOne({ _id: id });
  }

  async existsById(id: string): Promise<boolean> {
    const doc = await this.users.exists({ _id: id });
    return !!doc;
  }
}
