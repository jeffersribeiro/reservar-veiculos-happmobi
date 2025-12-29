import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john.new@doe.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe Jr.' })
  @IsOptional()
  @IsString()
  name?: string;
}
