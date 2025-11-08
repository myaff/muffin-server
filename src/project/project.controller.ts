import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Request() req, @Body() createProjectDto: Omit<CreateProjectDto, 'user'>) {
    return this.projectService.create(req.user.iss, createProjectDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.projectService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectService.findOne(req.user.iss, +id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(req.user.iss, +id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.projectService.remove(req.user.iss, +id);
  }
}
