import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('api/v1/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.getClients();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.getClient(+id);
  }

  @Get('/email')
  findByEmal(@Body() clientEmail:string){
    return this.clientService.findClientByEmail(clientEmail)
  }

  @Put()
  updateClient(@Body() updateClientDto: UpdateClientDto) {
    return this.clientService.updateClient(updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
