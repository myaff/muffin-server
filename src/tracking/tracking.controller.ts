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
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { isArray, isDateString } from 'class-validator';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import type { UserRequest } from 'src/base/userRequest';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  create(
    @Request() req: UserRequest,
    @Body()
    createTrackingDto:
      | Omit<CreateTrackingDto, 'user'>
      | Omit<CreateTrackingDto, 'user'>[],
  ) {
    const trackings = isArray(createTrackingDto)
      ? createTrackingDto
      : [createTrackingDto];
    return this.trackingService.create(req.user.iss, trackings);
  }

  @Get()
  findAll(@Request() req: UserRequest, @Query() query: unknown) {
    const options = this.getTransformedOptions(query);
    return this.trackingService.findAll(req.user.iss, options);
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    return this.trackingService.findOne(req.user.iss, +id);
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.trackingService.update(req.user.iss, +id, updateTrackingDto);
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    return this.trackingService.remove(req.user.iss, +id);
  }

  getTransformedOptions(query: unknown) {
    const options: FindOptionsWhere<Tracking> = {};
    if (!query || typeof query !== 'object') return options;
    const q = query as { [key: string]: string };
    const dateOptions = {
      dateFrom: q.dateFrom && isDateString(q.dateFrom) ? q.dateFrom : null,
      dateTo: q.dateTo && isDateString(q.dateTo) ? q.dateTo : null,
    };
    if (dateOptions.dateFrom && dateOptions.dateTo) {
      options.date = Between(dateOptions.dateFrom, dateOptions.dateTo);
    } else if (dateOptions.dateFrom) {
      options.date = MoreThanOrEqual(dateOptions.dateFrom);
    } else if (dateOptions.dateTo) {
      options.date = LessThanOrEqual(dateOptions.dateTo);
    }
    if (q.client || q.project) {
      options.task = {
        project: {
          ...(q.project &&
            isArray(q.project) &&
            q.project.length && {
              id: In(q.project.map((id) => Number.parseInt(id))),
            }),
          ...(q.client && { client: { id: Number.parseInt(q.client) } }),
        },
      };
    }
    return options;
  }
}
