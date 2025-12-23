import { Types } from 'mongoose';

export interface StartSessionOutput {
  userId: string;
  expiresAt: Date;
  accessToken: string;
}

export type StartSessionInput = {
  userId: Types.ObjectId;
  expiresAt: Date;
  userAgent?: string | null;
  ip?: string | null;
};
