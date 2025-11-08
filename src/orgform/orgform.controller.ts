import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgformService } from './orgform.service';
import { CreateOrgformDto } from './dto/create-orgform.dto';
import { UpdateOrgformDto } from './dto/update-orgform.dto';

@Controller('orgform')
export class OrgformController {
  constructor(private readonly orgformService: OrgformService) {}

  @Post()
  create(@Body() createOrgformDto: CreateOrgformDto) {
    return this.orgformService.create(createOrgformDto);
  }

  @Get()
  findAll() {
    return this.orgformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgformService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgformDto: UpdateOrgformDto) {
    return this.orgformService.update(+id, updateOrgformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgformService.remove(+id);
  }
}
