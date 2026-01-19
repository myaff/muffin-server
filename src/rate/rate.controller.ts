import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, ParseIntPipe } from '@nestjs/common';
import { RatePlanService } from './rate-plan.service';
import { RateVersionService } from './rate-version.service';
import { CreateRateVersionApi, CreateRateVersionDto } from './dto/create-rate-version.dto';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import type { UserRequest } from 'src/base/userRequest';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, MoreThan, Or } from 'typeorm';
import { RatePlan } from './entities/rate-plan.entity';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
import { UpdateRateVersionApi } from './dto/update-rate-version.dto';
import { RateVersion } from './entities/rate-version.entity';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { ProjectService } from 'src/project/project.service';
import { ClientService } from 'src/client/client.service';
import { addDays } from 'date-fns';
import { scaleMoney } from 'src/utils/money-scaler';

@Controller('rate')
export class RateController extends BaseController {
  constructor(
    private readonly planService: RatePlanService,
    private readonly versionService: RateVersionService,
    private readonly clientService: ClientService,
    private readonly projectService: ProjectService,
  ) {
    super();
    this.pageSize = 1000;
  }

  @Post()
  async create(@Request() req: UserRequest, @Body() dto: Omit<CreateRatePlanDto, 'user'>) {
    const user = { id: req.user.iss };
    const item: CreateRatePlanDto = { ...dto, user };
    const created = await this.planService.create(item);
    if (!created) return created;
    const version = {
      ...dto.version,
      amount: scaleMoney(dto.version.amount),
      overageHourly: dto.version?.overageHourly
        ? scaleMoney(dto.version.overageHourly)
        : undefined,
    };
    const createdVersion = await this.versionService.create({ ...version, ratePlan: { id: created.id } });
    if (!createdVersion) return created;
    created.versions.push(createdVersion);
    if (created.active && created.client?.id) {
      await this.clientService.update(
        { id: created.client.id, user },
        { ratePlan: { id: created.id } },
      );
    }
    if (created.active && created.project?.id) {
      await this.projectService.update(
        { id: created.project.id, user },
        { ratePlan: { id: created.id } },
      );
    }
    if (created.active) {
      const options: FindOptionsWhere<RatePlan> = {
        user,
        active: true,
        scope: created.scope,
        currency: { id: created.currency.id },
        ...(created.project?.id && { project: { id: created.project.id } }),
        ...(created.client?.id && { client: { id: created.client.id } }),
      };
      await this.planService.updateMany(options, { active: false });
    }
    return {
      ...created.toPlainObject(),
      versions: created.versions.map(i => i.toPlainObject()),
    };
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
      list: list.map(plan => plan.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOneOptions<RatePlan> = {
      where: { user: { id: req.user.iss }, id },
    };
    return this.planService
      .findOne(options)
      .then(item => item.toPlainObject());
  }

  @Patch(':id')
  update(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRatePlanDto) {
    const options: FindOptionsWhere<RatePlan> = {
      user: { id: req.user.iss },
      id,
    };
    return this.planService
      .update(options, dto)
      .then(item => item.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOptionsWhere<RatePlan> = {
      user: { id: req.user.iss },
      id,
    };
    return this.planService.remove(options);
  }

  @Post(':id/version')
  async createVersion(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Omit<CreateRateVersionApi, 'user'>,
  ) {
    const item: CreateRateVersionDto = {
      ...dto,
      amount: scaleMoney(dto.amount),
      overageHourly: dto?.overageHourly ? scaleMoney(dto.overageHourly) : undefined,
      ratePlan: { id },
      user: { id: req.user.iss },
    };
    const created = await this.versionService.create(item);
    if (created) {
      const maxDate = addDays(new Date(created.startDate), -1);
      const options: FindOptionsWhere<RateVersion> = {
        user: { id: req.user.iss },
        ratePlan: { id },
        endDate: Or(IsNull(), MoreThan(maxDate)),
      };
      await this.versionService.updateMany(options, { endDate: maxDate.toISOString() });
    }
    return created.toPlainObject();
  }

  @Patch(':id/version/:vid')
  updateVersion(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('vid', ParseIntPipe) vid: number,
    @Body() dto: UpdateRateVersionApi,
  ) {
    const options: FindOptionsWhere<RateVersion> = {
      user: { id: req.user.iss },
      ratePlan: { id },
      id: vid,
    };
    const item = {
      ...dto,
      amount: dto?.amount ? scaleMoney(dto.amount) : undefined,
      overageHourly: dto?.overageHourly ? scaleMoney(dto.overageHourly) : undefined,
    };
    return this.versionService
      .update(options, item)
      .then(item => item.toPlainObject());
  }

  @Delete(':id/version/:vid')
  removeVersion(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('vid', ParseIntPipe) vid: number,
  ) {
    const options: FindOptionsWhere<RateVersion> = {
      user: { id: req.user.iss },
      ratePlan: { id },
      id: vid,
    };
    return this.versionService.remove(options);
  }
}
