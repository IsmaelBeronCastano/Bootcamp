# NEST WEB3js

- En backend, en src tengo el módulo de dogs que me va a permitir comunicarme con un smart contract que desplegaré en la blockchain
- Voy a poder realizar peticiones desde el backend al smart contract (de ahora en adelante SC)
- El dto de create-dog tiene el nombre, la raza y el color del perro

~~~js
import { IsString } from "class-validator";

export class CreateDogDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly breed: string;
    
    @IsString()
    readonly color: string;
}
~~~

- La dog.entity

~~~js
export class Dog {
    readonly id: string;
    readonly name: string;
    readonly breed: string;
    readonly color: string;
    readonly availableForAdpt: boolean

    constructor(
        id: string, 
        name: string, 
        breed: string, 
        color: string,
        availableForAdpt: boolean) 
    {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.color = color;
        this.availableForAdpt = availableForAdpt;
    }
}
~~~

- El dogs.module queda asi

~~~js
import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { DogsController } from './dogs.controller';

@Module({
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
~~~

- En el dogs.controller tengo un create y un findOne.
- Usaremos findOne para comprobar si existe el perro

~~~js
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  create(@Body() createDogDto: CreateDogDto) {
    return this.dogsService.create(createDogDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.dogsService.findOne(id);
  }
}
~~~

- En el dogs.service

~~~js
import { Injectable, NotFoundException, Body } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import Web3 from 'web3';

import { Dog } from './entities/dog.entity';
import { CreateDogDto } from './dto';
import { abi } from '../contracts/Dog.json';
import { address } from '../contracts/Dog-address.json';

@Injectable()
export class DogsService {
                                            //retorna una promesa
  async create(createDogDto: CreateDogDto): Promise<Dog> {

    //genero un objeto web3 con un nodo levantado en el localhost con ganache
    const web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:7545')
    );
                            //accedo al contrato con el abi y la address que generará el contrato una vez desplegado en la blockchain
    const contract = new web3.eth.Contract(abi, address);

    const id: string = uuid();//creo un UUID

    //Creo el objeto de Dog
    const dog = new Dog(
      id,
      createDogDto.name,
      createDogDto.breed,
      createDogDto.color,
      true
    );

    try {                  //uso el metodo registerDog de mi contrato Dog.sol
      const result = await contract.methods.registerDog(id, dog.name, dog.breed, dog.color, dog.availableForAdpt).send({
        from: '0xda50f755351cB8977Aff1b3A82a0630BEB1e9da4', //le paso mi dirección
        gas: '500000' //le paso la cantidad de gas
      });

      return dog; //devuelvo el perro y si no capturo el error
    } catch (error) {
      console.error('Error al interactuar con el contrato:', error);
      throw error;
    }
  }

  async findOne(id: string) {

    //creo el objeto web3 enlazado a la blovkchain desplegada en mi localhost que conecta con el smartcontract
    const web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:7545')
    );

    //le paso la abi y la address al contrato
    const contract = new web3.eth.Contract(abi, address);

    try {
      // Llama a un método del contrato
      const result = await contract.methods.findDog(id).call();

      // Formatea los datos obtenidos del contrato para que coincidan con la estructura de un "dog"
      const dog = new Dog(
        result['uuid'],
        result['name'],
        result['breed'],
        result['color'],
        result['availableForAdpt']
      );

      return dog;
    } catch (error) {
      console.error('Error al interactuar con el contrato:', error);
      throw error;
    }
  }
}
~~~

- La blockchain está configurada con hardhat
- En blockachain/contracts n(tengo dos carpetas main, una backend y otra blockchain) tengo a Dog.sol

~~~solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Dog is ERC721 {
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function registerDog(
        string memory _uuid,
        string memory _name,
        string memory _breed,
        string memory _color,
        bool _availableForAdpt
    ) public {
        require(msg.sender == owner, "Only the owner can call this function");
        uint256 newItemId = _tokensIds.current();
        DogInfo memory dog = DogInfo(
            newItemId,
            _uuid,
            _name,
            _breed,
            _color,
            _availableForAdpt
        );
        dogs.push(dog);
        _safeMint(msg.sender, newItemId);
        _tokensIds.increment();
    }

    // Counters NFTs
    using Counters for Counters.Counter;
    Counters.Counter private _tokensIds;

    // Data structure with the properties of the Dogs
    struct DogInfo {
        uint256 id;
        string uuid;
        string name;
        string breed;
        string color;
        bool availableForAdpt;
    }

    // Storage structure for keeping Dogs
    DogInfo[] public dogs;

    function totalSupply() public view returns (uint) {
        return dogs.length;
    }

    function findDog(string memory _uuid) public view returns (DogInfo memory) {
        for (uint256 i = 0; i < dogs.length; i++) {
            if (keccak256(bytes(dogs[i].uuid)) == keccak256(bytes(_uuid))) {
                return dogs[i];
            }
        }
        revert("Dog not found");
    }
}
~~~

- En el app.module

~~~js
import { Module } from '@nestjs/common';
import { DogsModule } from './dogs/dogs.module';
import { DogsController } from './dogs/dogs.controller';
import { DogsService } from './dogs/dogs.service';

@Module({
  imports: [DogsModule],
  controllers: [DogsController],
  providers: [DogsService],
})
export class AppModule {}
~~~

- En el main tengo las validaciones para el dto con GlobalPipes 

~~~js
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  
  await app.listen(3000);
}
bootstrap();
~~~

- Minuto 7:43



