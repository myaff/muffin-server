import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { RatePlanService } from './rate-plan.service';
import { RateVersionService } from './rate-version.service';
import { CreateRateVersionDto } from './dto/create-rate-version.dto';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import type { UserRequest } from 'src/base/userRequest';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { RatePlan } from './entities/rate-plan.entity';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
import { UpdateRateVersionDto } from './dto/update-rate-version.dto';
import { RateVersion } from './entities/rate-version.entity';
import { BaseController, type QueryObject } from 'src/base/baseController';

@Controller('rate')
export class RateController extends BaseController {
  constructor(
    private readonly planService: RatePlanService,
    private readonly versionService: RateVersionService,
  ) {
    super();
    this.pageSize = 1000;
  }

  @Post()
  create(@Request() req: UserRequest, @Body() dto: Omit<CreateRatePlanDto, 'user'>) {
    const item: CreateRatePlanDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.planService.create(item);
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const options: FindManyOptions<RatePlan> = {
      where: { user: { id: req.user.iss } },
      ...paginationOptions,
    };
    const [list, count] = await this.planService.findAll(options);
    return {
      list,
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOneOptions<RatePlan> = {
      where: { user: { id: req.user.iss }, id: +id },
    };
    return this.planService.findOne(options);
  }

  @Patch(':id')
  update(@Request() req: UserRequest, @Param('id') id: string, @Body() dto: UpdateRatePlanDto) {
    const options: FindOptionsWhere<RatePlan> = {
      user: { id: req.user.iss },
      id: +id,
    };
    return this.planService.update(options, dto);
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<RatePlan> = {
      user: { id: req.user.iss },
      id: +id,
    };
    return this.planService.remove(options);
  }

  @Post(':id/version')
  createVersion(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: Omit<CreateRateVersionDto, 'user'>,
  ) {
    const item: CreateRateVersionDto = {
      ...dto,
      ratePlan: { id: +id },
      user: { id: req.user.iss },
    };
    return this.versionService.create(item);
  }

  @Patch(':id/version/:vid')
  updateVersion(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Param('vid') vid: string,
    @Body() dto: UpdateRateVersionDto,
  ) {
    const options: FindOptionsWhere<RateVersion> = {
      user: { id: req.user.iss },
      ratePlan: { id: +id },
      id: +vid,
    };
    return this.versionService.update(options, dto);
  }

  @Delete(':id/version/:vid')
  removeVersion(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Param('vid') vid: string,
  ) {
    const options: FindOptionsWhere<RateVersion> = {
      user: { id: req.user.iss },
      ratePlan: { id: +id },
      id: +vid,
    };
    return this.versionService.remove(options);
  }
}
