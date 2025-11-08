import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: Omit<CreateTaskDto, 'user'>) {
    return this.taskService.create(req.user.iss,createTaskDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.taskService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.taskService.findOne(req.user.iss, +id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(req.user.iss, +id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.taskService.remove(req.user.iss, +id);
  }
}
