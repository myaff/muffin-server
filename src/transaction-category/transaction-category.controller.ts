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
import type { UserRequest } from 'src/base/userRequest';
import { TransactionCategoryService } from './transaction-category.service';
import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { TransactionCategory } from './entities/transaction-category.entity';

@Controller('transaction-category')
export class TransactionCategoryController extends BaseController {
  constructor(
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {
    super();
    this.pageSize = 100;
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: Omit<CreateTransactionCategoryDto, 'user'>,
  ) {
    const item: CreateTransactionCategoryDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.transactionCategoryService.create(item);
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const whereOptions = { user: { id: req.user.iss } };
    const options: FindManyOptions<TransactionCategory> = {
      where: whereOptions,
      order: { createdAt: 'DESC' },
      ...paginationOptions,
    };
    const count = await this.transactionCategoryService.count({ where: whereOptions });
    const list = await this.transactionCategoryService.findAll(options);
    return {
      list,
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOneOptions<TransactionCategory> = {
      where: { user: { id: req.user.iss }, id: +id },
    };
    return this.transactionCategoryService.findOne(options);
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionCategoryDto,
  ) {
    const options: FindOptionsWhere<TransactionCategory> = {
      id: +id,
      user: { id: req.user.iss },
    };
    return this.transactionCategoryService.update(options, dto);
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<TransactionCategory> = {
      id: +id,
      user: { id: req.user.iss },
    };
    return this.transactionCategoryService.remove(options);
  }
}
