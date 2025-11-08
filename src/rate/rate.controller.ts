import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  create(@Request() req, @Body() createRateDto: Omit<CreateRateDto, 'user'>) {
    return this.rateService.create(req.user.iss, createRateDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.rateService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.rateService.findOne(req.user.iss, +id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.rateService.update(req.user.iss, +id, updateRateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.rateService.remove(req.user.iss, +id);
  }
}
