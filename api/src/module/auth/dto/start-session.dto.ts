import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class StartSessionDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(254, { message: 'email is too long' })
  email!: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(72, { message: 'password is too long' }) // 72 is common when hashing with bcrypt
  password!: string;
}
