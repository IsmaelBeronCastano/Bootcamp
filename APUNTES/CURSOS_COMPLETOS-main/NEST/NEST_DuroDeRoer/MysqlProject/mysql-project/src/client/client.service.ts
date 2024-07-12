import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';


@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ){}

  findClient(client: CreateClientDto){
    return this.clientRepository.findOne({
      where:[
        {id: client.id},
        {email: client.email}
      ]
    })
  }

  findClientByEmail(email: string){
    return this.clientRepository.findOne({
      where: {email}
    })
  }

 async createClient(client: CreateClientDto) {
    const clientExists = await this.findClient(client)
    if(clientExists){
      if(client.id){
        throw new BadRequestException(`El cliente con id ${client.id} ya existe` )
      }else{
        throw new BadRequestException(`El cliente con el email ${client.email} ya existe`)
      }
    }

    let addressExists: Address = null;
    
    if(client.address.id){
      addressExists = await this.addressRepository.findOne({
        where: {
          id: clientExists.address.id
        }
      })
    }else{
      addressExists = await this.addressRepository.findOne({
        where:{
          country: client.address.country,
          province: client.address.province,
          city: client.address.city,
          street: client.address.street
        }
      })
    } 

    if(addressExists){
      throw new ConflictException("Esta dirección ya está registrada")
    }
    return this.clientRepository.save(client)
  }

  async getClients() {
    return await this.clientRepository.find();
  }

  async getClient(id: number) {
    const clientExists= await this.clientRepository.findOne({
      where: {id}
    })

    if(!clientExists){
      throw new BadRequestException("El cliente no existe")
    }

    return clientExists;
  }

  async updateClient(client: UpdateClientDto) {
    if(!client.id){
      return this.createClient(client as CreateClientDto)
    }

    let clientExists = await this.findClientByEmail(client.email)

    if(clientExists && clientExists.id != client.id){
      throw new ConflictException(`El cliente con el email ${client.email} ya existe`)
    }

    clientExists = await this.getClient(client.id) //busco el cliente por id

    let addressExists: Address = null;
    let deletedAddress = false
    if(client.address.id){
      addressExists = await this.addressRepository.findOne({
        where: {
          id: clientExists.address.id
        }
      })


    }else{
      addressExists = await this.addressRepository.findOne({
        where:{
          country: client.address.country,
          province: client.address.province,
          city: client.address.city,
          street: client.address.street
        }
      })

      if(addressExists){
        throw new ConflictException("La dirección ya existe")
      }else{
        deletedAddress = true
      }
    } 

    

    if(addressExists && addressExists.id != clientExists.address.id){
      throw new ConflictException("La dirección ya existe")
    }else if(JSON.stringify(addressExists) != JSON.stringify(client.address) ){
      //si la dirección que me pasa el cliente es distinta a la dirección que existe
      addressExists = await this.addressRepository.findOne({
        where:{
          country: client.address.country,
          province: client.address.province,
          city: client.address.city,
          street: client.address.street
        } })

        if(addressExists){
          throw new ConflictException("La dirección ya existe")
        }else{
          deletedAddress = true
        }
    }

    const updatedClient= await this.clientRepository.save(client) 

    if(deletedAddress){     //clientExists es el que cogemos de la DB, el que tiene su id original con la address desreferenciada
      await this.addressRepository.delete({id: clientExists.address.id})
    }

    return updatedClient;
    
  }



  async remove(id: number) {
    const clientExists = await this.getClient(id) //este método creado por mi ya contempla la excepción

    const rows = await this.clientRepository.delete({id}) //devuelve un DeleteResult

    if (rows.affected == 1){
      await this.addressRepository.delete({id: clientExists.address.id})
    }

    return
  }
}