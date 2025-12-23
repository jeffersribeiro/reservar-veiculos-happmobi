import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { Public } from './decorators/public-route.decorator';
import { StartSessionOutput } from './auth.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('session/start')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start (create) a session and return tokens' })
  @ApiResponse({ status: 200, description: 'Session started' })
  async startSession(
    @Body() dto: StartSessionDto,
  ): Promise<StartSessionOutput> {
    return this.authService.startSession(dto);
  }

  @ApiBearerAuth('jwt')
  @Post('session/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End (invalidate) the current session' })
  @ApiResponse({ status: 200, description: 'Session ended' })
  async endSession(@Body() dto: EndSessionDto): Promise<void> {
    return await this.authService.endSession(dto);
  }
}
