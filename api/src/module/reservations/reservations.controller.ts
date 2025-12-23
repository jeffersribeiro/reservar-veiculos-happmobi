import {
  Controller,
  Post,
  Param,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationService } from './reservations.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type AuthUser = {
  id: string;
  email?: string;
};

@ApiBearerAuth('jwt')
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post(':vehicleId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reserve a vehicle (current user)' })
  @ApiResponse({ status: 201 })
  reserve(
    @CurrentUser() user: AuthUser,
    @Param('vehicleId') vehicleId: string,
  ) {
    const userId = user.id;
    return this.service.reserveVehicle(userId, vehicleId);
  }

  @Post(':id/finish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finish reservation' })
  @ApiResponse({ status: 200 })
  finish(@Param('id') id: string) {
    return this.service.finishReservation(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiResponse({ status: 200 })
  cancel(@Param('id') id: string) {
    return this.service.cancelReservation(id);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List reservations for current user' })
  @ApiResponse({ status: 200 })
  listMine(@CurrentUser() user: AuthUser) {
    const userId = user.id;
    return this.service.listUserReservations(userId);
  }
}
