import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from './users.type';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120,
  })
  name!: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
    unique: true,
    index: true,
  })
  email!: string;

  @Prop({
    required: true,
    minlength: 30,
    maxlength: 255,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    type: [String],
    default: ['USER'],
    index: true,
  })
  roles!: UserRole[];

  @Prop({
    default: true,
    index: true,
  })
  isActive!: boolean;

  @Prop({ default: 1 })
  _schemaVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1, emailVerified: 1 });
