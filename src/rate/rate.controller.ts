import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { RatePlanService } from './rate-plan.service';
import { RateVersionService } from './rate-version.service';
import { CreateRateVersionDto } from './dto/create-rate-version.dto';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import type { UserRequest } from 'src/base/userRequest';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, MoreThan, Or } from 'typeorm';
import { RatePlan } from './entities/rate-plan.entity';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
import { UpdateRateVersionDto } from './dto/update-rate-version.dto';
import { RateVersion } from './entities/rate-version.entity';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { ProjectService } from 'src/project/project.service';
import { ClientService } from 'src/client/client.service';
import { addDays } from 'date-fns';

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
    const createdVersion = await this.versionService.create({ ...dto.version, ratePlan: { id: created.id } });
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
    return created;
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
  async createVersion(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: Omit<CreateRateVersionDto, 'user'>,
  ) {
    const item: CreateRateVersionDto = {
      ...dto,
      ratePlan: { id: +id },
      user: { id: req.user.iss },
    };
    const created = await this.versionService.create(item);
    if (created) {
      const maxDate = addDays(new Date(created.startDate), -1);
      const options: FindOptionsWhere<RateVersion> = {
        user: { id: req.user.iss },
        ratePlan: { id: +id },
        endDate: Or(IsNull(), MoreThan(maxDate)),
      };
      await this.versionService.updateMany(options, { endDate: maxDate.toISOString() });
    }
    return created;
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
