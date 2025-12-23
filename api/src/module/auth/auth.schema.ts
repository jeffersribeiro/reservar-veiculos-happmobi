import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  collection: 'sessions',
  timestamps: true,
})
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, default: null })
  userAgent?: string | null;

  @Prop({ type: String, ddefault: null })
  ip?: string | null;

  @Prop({ required: true, index: true })
  expiresAt!: Date;

  @Prop({ default: false, index: true })
  revoked!: boolean;

  @Prop({ type: Date, ddefault: null })
  revokedAt?: Date | null;

  @Prop({ default: 1 })
  _schemaVersion: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

SessionSchema.index({ userId: 1, revoked: 1 });
SessionSchema.index({ refreshTokenHash: 1, revoked: 1 });
