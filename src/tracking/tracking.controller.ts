import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { isArray } from 'class-validator';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
} from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import type { UserRequest } from 'src/base/userRequest';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { TrackingCalendar } from './entities/tracking-calendar';

@Controller('tracking')
export class TrackingController extends BaseController {
  constructor(private readonly trackingService: TrackingService) {
    super();
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body()
    dto:
      | Omit<CreateTrackingDto, 'user'>
      | Omit<CreateTrackingDto, 'user'>[],
  ) {
    const trackingsArr = isArray(dto) ? dto : [dto];
    const items = trackingsArr.map(item => ({
      ...item,
      user: { id: req.user.iss },
    }));
    return this.trackingService
      .create(items)
      .then(data => data.map(i => i.toPlainObject()));
  }

  @Get()
  async findAll(
    @Request() req: UserRequest,
    @Query() q: QueryObject,
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    const paginationOptions = this.getPaginationOptions(q);
    const whereOptions = {
      user: { id: req.user.iss },
      ...this.getFilterOptions(q),
    };
    const options: FindManyOptions<Tracking> = {
      where: whereOptions,
      order: { [sortBy]: order, 'createdAt': 'ASC' },
      ...paginationOptions,
    };
    const count = await this.trackingService.count({ where: whereOptions });
    const list = await this.trackingService.findAll(options);
    return {
      list: list.map(t => t.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }
  @Get('calendar')
  async findCalendar(
    @Request() req: UserRequest,
    @Query() q: QueryObject,
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    const whereOptions = {
      user: { id: req.user.iss },
      ...this.getFilterOptions(q),
    };
    const options: FindManyOptions<Tracking> = {
      where: whereOptions,
      order: { [sortBy]: order, 'createdAt': 'ASC' },
    };
    const list = await this.trackingService.findAll(options);
    return new TrackingCalendar(list).toPlainObject();
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options = {
      where: {
        user: { id: req.user.iss },
        id,
      },
    };
    return this.trackingService
      .findOne(options)
      .then(data => data.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrackingDto,
  ) {
    const options = {
      user: { id: req.user.iss },
      id,
    };
    return this.trackingService
      .update(options, dto)
      .then(data => data.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options = {
      user: { id: req.user.iss },
      id,
    };
    return this.trackingService.remove(options);
  }

  getFilterOptions(query: QueryObject) {
    const options: FindOptionsWhere<Tracking> = {};
    if (!query || typeof query !== 'object') return options;
    options.date = this.getDatesFilterOptions(query) ?? undefined;
    if (query?.client || query?.project) {
      options.task = {
        project: {
          ...(query.project
            && isArray(query.project)
            && query.project.length
            && {
              id: In(query.project.map(Number)),
            }),
          ...(query.client
            && { client: { id: Number(query.client) } }),
        },
      };
    }
    if (query?.billable) {
      options.billable = true;
    }
    if (query?.billed) {
      options.invoice = {
        id: query.billed ? Not(IsNull()) : IsNull(),
      };
    }
    if (query?.invoiceId) {
      options.invoice = { id: Number(query.invoiceEntryId) };
    }
    return options;
  }
}
