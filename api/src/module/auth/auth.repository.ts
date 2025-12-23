import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SessionDocument, Session } from './auth.schema';
import { StartSessionInput } from './auth.type';

export class AuthRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessions: Model<SessionDocument>,
  ) {}

  async create(input: StartSessionInput): Promise<string> {
    const doc = await this.sessions.create({
      userId: input.userId,
      expiresAt: input.expiresAt,
      userAgent: input.userAgent ?? null,
      ip: input.ip ?? null,
      revoked: false,
      revokedAt: null,
    });

    return String(doc._id);
  }

  async findOneById(sessionId: string): Promise<SessionDocument | null> {
    return await this.sessions.findOne({
      _id: sessionId,
    });
  }

  async endSession(sessionId: string): Promise<boolean> {
    const now = new Date();

    const filter = { _id: new Types.ObjectId(sessionId), revoked: false };

    const res = await this.sessions.updateOne(filter, {
      $set: { revoked: true, revokedAt: now },
    });

    return res.modifiedCount > 0;
  }
}
