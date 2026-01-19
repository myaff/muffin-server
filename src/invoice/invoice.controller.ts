import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException, Query, NotImplementedException, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceApi, CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceApi, UpdateInvoiceDto } from './dto/update-invoice.dto';
import type { UserRequest } from 'src/base/userRequest';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { RateType } from 'src/rate/constants';
import { isString } from 'class-validator';

@Controller('invoice')
export class InvoiceController extends BaseController {
  constructor(
    private readonly invoiceService: InvoiceService,
  ) {
    super();
  }

  @Post()
  async create(@Request() req: UserRequest, @Body() dto: CreateInvoiceApi) {
    if (!dto?.entries?.length) return new BadRequestException('Provide at least one entry');
    const item: CreateInvoiceDto = {
      user: { id: req.user.iss },
      type: dto.type,
      client: dto.client,
      project: dto.project,
      currency: dto.currency,
      startDate: dto.startDate,
      endDate: dto.endDate,
      issuedDate: dto.issuedDate,
      dueDate: dto.dueDate,
      paidDate: dto.paidDate,
      status: dto.status,
    };
    const entryDtos = dto.entries.map(eDto => ({
      key: eDto.key,
      name: eDto.name,
      user: { id: req.user.iss },
    }));
    return this.invoiceService
      .create(item, entryDtos)
      .then(item => item.toPlainObject());
  }

  @Get()
  findAll(@Request() req: UserRequest) {
    const options: FindManyOptions<Invoice> = {
      where: { user: { id: req.user.iss } },
    };
    return this.invoiceService
      .findAll(options)
      .then(items => items.map(item => item.toPlainObject()));
  }

  @Get('preview')
  async preview(@Request() req: UserRequest, @Query() query: QueryObject) {
    const rateType = isString(query.type)
      && Object.values<string>(RateType).includes(query.type)
      ? query.type as RateType
      : null;
    if (!rateType) throw new BadRequestException('rate type is required');
    const options = {
      ...this.getTrackingFilterOptions(query),
      user: { id: req.user.iss },
    };
    if (rateType !== RateType.HOURLY) throw new NotImplementedException();
    const preview = await this.invoiceService.previewHourly(options);
    return preview.toPlainObject();
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOneOptions<Invoice> = {
      where: {
        user: { id: req.user.iss },
        id,
      },
    };
    return this.invoiceService
      .findOne(options)
      .then(data => data.toPlainObject());
  }

  @Patch(':id')
  update(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvoiceApi) {
    const options: FindOptionsWhere<Invoice> = {
      user: { id: req.user.iss },
      id,
    };
    const item: UpdateInvoiceDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.invoiceService
      .update(options, item)
      .then(data => data.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOptionsWhere<Invoice> = {
      user: { id: req.user.iss },
      id,
    };
    return this.invoiceService.remove(options);
  }

  private getTrackingFilterOptions(query: QueryObject) {
    const options: FindOptionsWhere<Tracking> = {};
    if (!query || typeof query !== 'object') return options;
    options.date = this.getDatesFilterOptions(query) ?? undefined;
    if (query?.clientId) {
      options.task = {
        project: { client: { id: Number(query.clientId) } },
      };
    }
    return options;
  }
}
