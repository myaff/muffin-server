import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post()
  create(@Request() req, @Body() createClientDto: Omit<CreateClientDto, 'user'>) {
    return this.clientService.create(req.user.iss, createClientDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.clientService.findOne(req.user.iss, { where: { id: +id, } });
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(req.user.iss, +id, updateClientDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.clientService.remove(req.user.iss, +id);
  }
}
