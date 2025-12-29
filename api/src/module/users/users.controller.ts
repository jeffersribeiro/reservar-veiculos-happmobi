import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public-route.decorator';
import type { CurrentUserShape } from '../auth/decorators/current-user.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiBearerAuth('jwt')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/me')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'get current user authenticated' })
  @ApiResponse({ status: 201, description: 'user authenticated' })
  async getCurrentUser(@CurrentUser() user: CurrentUserShape) {
    return this.service.getCurrentUser(user.id);
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'user created' })
  @UseInterceptors(FileInterceptor('avatarPhotoUrl'))
  async create(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update an existing user by id' })
  @ApiResponse({ status: 204, description: 'user updated' })
  @ApiResponse({ status: 404, description: 'user not found' })
  @UseInterceptors(FileInterceptor('avatarPhotoUrl'))
  async update(
    @CurrentUser() user: CurrentUserShape,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.service.update(user.id, dto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 204, description: 'user removed' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
