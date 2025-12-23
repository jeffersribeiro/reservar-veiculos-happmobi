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
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { VehiclesService } from './vehicles.service';
import type { ListAvailableVehiclesInput } from './vehicles.type';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from './services/upload.service';

@ApiBearerAuth('jwt')
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly service: VehiclesService,
  ) {}

  @Get('available')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'return from databse a lista of all vehicles with AVAILABLE status',
  })
  @ApiResponse({ status: 200, description: 'list of available vehicles' })
  listAvailable(@Query() query: any) {
    const input: ListAvailableVehiclesInput = {
      brand: query.brand,
      category: query.category,
      model: query.model,
      plate: query.plate,
      minDailyPrice: query.minDailyPrice
        ? Number(query.minDailyPrice)
        : undefined,
      maxDailyPrice: query.maxDailyPrice
        ? Number(query.maxDailyPrice)
        : undefined,
      skip: query.skip ? Number(query.skip) : 0,
      limit: query.limit ? Number(query.limit) : 50,
    };

    return this.service.listAvailable(input);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a new vehicle' })
  @ApiResponse({ status: 201, description: 'vehicle created' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async create(
    @Body() body: CreateVehicleDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    return this.service.createVehicle(body, files.images);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update a vehicle by id' })
  @ApiResponse({ status: 200, description: 'vehicle updated' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateVehicleDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    return this.service.updateVehicle(id, body, files.images);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'remove a vehicle by id (soft delete)' })
  @ApiResponse({ status: 200, description: 'vehicle removed' })
  remove(@Param('id') id: string) {
    return this.service.removeVehicle(id);
  }
}
