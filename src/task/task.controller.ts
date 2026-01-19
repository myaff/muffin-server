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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { UserRequest } from 'src/base/userRequest';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController extends BaseController {
  constructor(private readonly taskService: TaskService) {
    super();
    this.pageSize = 1000;
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: Omit<CreateTaskDto, 'user'>,
  ) {
    const item: CreateTaskDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.taskService
      .create(item)
      .then(item => item.toPlainObject());
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const whereOptions: FindOptionsWhere<Task> = {
      user: { id: req.user.iss },
    };
    const options: FindManyOptions<Task> = {
      where: whereOptions,
      order: { 'createdAt': 'DESC' },
      ...paginationOptions,
    };
    const count = await this.taskService.count({ where: whereOptions });
    const list = await this.taskService.findAll(options);
    return {
      list: list.map(i => i.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOneOptions<Task> = {
      where: {
        id,
        user: { id: req.user.iss },
      },
    };
    return this.taskService
      .findOne(options)
      .then(i => i.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    const options: FindOptionsWhere<Task> = {
      id,
      user: { id: req.user.iss },
    };
    return this.taskService
      .update(options, dto)
      .then(i => i?.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOptionsWhere<Task> = {
      id,
      user: { id: req.user.iss },
    };
    return this.taskService.remove(options);
  }
}
