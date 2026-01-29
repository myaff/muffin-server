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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { UserRequest } from 'src/base/userRequest';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Project } from './entities/project.entity';

@Controller('project')
export class ProjectController extends BaseController {
  constructor(private readonly projectService: ProjectService) {
    super();
    this.pageSize = 100;
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: Omit<CreateProjectDto, 'user'>,
  ) {
    const item: CreateProjectDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.projectService
      .create(item)
      .then(data => data.toPlainObject());
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const whereOptions: FindOptionsWhere<Project> = {
      user: { id: req.user.iss },
    };
    const options: FindManyOptions<Project> = {
      where: whereOptions,
      order: { active: 'DESC', createdAt: 'DESC' },
      ...paginationOptions,
    };
    const count = await this.projectService.count({ where: whereOptions });
    const list = await this.projectService.findAll(options);
    return {
      list: list.map(i => i.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOneOptions<Project> = {
      where: {
        id,
        user: { id: req.user.iss },
      },
    };
    return this.projectService
      .findOne(options)
      .then(data => data.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    const options: FindOptionsWhere<Project> = {
      id,
      user: { id: req.user.iss },
    };
    return this.projectService
      .update(options, dto)
      .then(data => data.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    const options: FindOptionsWhere<Project> = {
      id,
      user: { id: req.user.iss },
    };
    return this.projectService.remove(options);
  }
}
