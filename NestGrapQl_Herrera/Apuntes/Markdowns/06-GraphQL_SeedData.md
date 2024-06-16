# 06 Nest gRaphQL - Seed

- La variable de entorno STATE (ahora en dev) nos servirá para que cuando estemos en producción no podamos ejecutar el seed y nos destruya la DB
- Vamos a llenar la DB con usuarios e items
- Se agradece tener un seed y una documentación es bastante valioso
----

## Seed Resolver

- Creamos el módulo de seed
- El seed se podría hacer como una query, pero tecnicamente es una mutación  

> nest g res seed --no-spec

- Selecciono GraphQL code first sin endpoints
- Dentro de seed creo la carpeta data con la data a insertar

~~~js
export const SEED_USERS = [
    {
        fullName: 'Fernando Herrera',
        email: 'fernando@google.com',
        password: '123456',
        roles: ['admin','superUser','user'],
        isActive: true
    },
    {
        fullName: 'Melissa Flores',
        email: 'melissa@google.com',
        password: '123456',
        roles: ['user'],
        isActive: true
    },
    {
        fullName: 'Hernando Vallejo',
        email: 'hernando@google.com',
        password: '123456',
        roles: ['user'],
        isActive: false
    },
]

export const SEED_ITEMS = [
    {
        name: "Chicken breast (skinless,boneless)",
        quantityUnits: "lb",
        category: "meat"
    },
    {
        name: "Chicken thighs (skinless,boneless)",
        quantityUnits: "box",
        category: "meat"
    },
    {
        name: "Fish filets",
        quantityUnits: "unit",
        category: "meat"
    },
    {
        name: "Ground turkey or chicken",
        quantityUnits: "lb",
        category: "meat"
    },
    {
        name: "Lean ground beef",
        quantityUnits: "pound",
        category: "meat"
    },
    {
        name: "Veggie burgers",
        quantityUnits: "box",
        category: "meat"
    },
    {
        name: "Chicken breast (skinless,boneless)",
        quantityUnits: "unit",
        category: "meat"
    },
    {
        name: "Chicken thighs (skinless,boneless)",
        quantityUnits: "box",
        category: "meat"
    },
    {
        name: "Chicken salad (made with lower calorie mayo)",
        quantityUnits: null,
        category: "meat"
    },
    {
        name: "Tuna salad (made with lower calorie mayo)",
        quantityUnits: null,
        category: "meat"
    },
    {
        name: "Egg salad (made with lower calorie mayo)",
        quantityUnits: "unit",
        category: "meat"
    },
    {
        name: "Lean ground beef",
        quantityUnits: "pound",
        category: "meat"
    },
    {
        name: "Ground turkey or chicken",
        quantityUnits: "pound",
        category: "meat"
    },
    {
        name: "Mixed vegetables",
        quantityUnits: "bag",
        category: "vegetables"
    },
    {
        name: "Brussels sprouts",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Arugula",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Asparagus",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Broccoli",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Bell peppers (green, red, orange, yellow or roasted in a jar)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Cabbage (green or red)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Carrots",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Cauliflower",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Celery",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Corn",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Cucumber",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Eggplant",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Endive",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Garlic",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Ginger",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Green beans (not canned)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Green beans",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Green onion",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Jalapeños",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Kale",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Leeks",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Lettuce (iceberg, romaine)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Onions",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Parsley",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Peas (not canned)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Peas",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Radicchio",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Radishes",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Shiitake mushrooms",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Summer squash (yellow)",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Turnip",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Turnip greens",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Watercress",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Zucchini",
        quantityUnits: null,
        category: "vegetables"
    },
    {
        name: "Apples",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Blackberries",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Blueberries",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Cherries",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Fruit cocktail (not packed in syrup)",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Grapes",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Lemons",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Limes",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Peaches (not packed in syrup)",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Pears",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Pineapple",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Plums",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Raspberries",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Strawberries",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Tangerine",
        quantityUnits: null,
        category: "fruits"
    },
    {
        name: "Rice: Brown, basmati, or jasmine",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "Cereals: corn flakes, chex, rice",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "krispies, puffed rice, puffed",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "Couscous",
        quantityUnits: null,
        category: "grainsits"
    },
    {
        name: "Oatmeal",
        quantityUnits: null,
        category: "grainsuits"
    },
    {
        name: "Cream of wheat",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "Grits",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "Crackers (unsalted and without added phosphorus)",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "Pasta (whole wheat or white)",
        quantityUnits: null,
        category: "grains"
    },
    {
        name: "English muffins",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Polenta",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Whole wheat breads",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Whole grain breads",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Rye bread",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Tortillas (without added phosphorus)",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Sourdough bread",
        quantityUnits: null,
        category: "bread"
    },
    {
        name: "Parsley",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Basil",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Oregano",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Garlic powder (not garlic salt)",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Black pepper",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Red pepper flakes",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Cayenne",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "No salt added chili powder",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Old Bay",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Cumin",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Coriander",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Thyme",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Turmeric",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Cinnamon",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Curry powder",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Chives",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Ginger",
        quantityUnits: null,
        category: "dried herbs and spices"
    },
    {
        name: "Water",
        quantityUnits: 'gl',
        category: "beverages"
    },
    {
        name: "Coffee",
        quantityUnits: "bag",
        category: "beverages"
    },
    {
        name: "Tea",
        quantityUnits: "box",
        category: "beverages"
    },
    {
        name: "Sodas (Pepsi, Coke)",
        quantityUnits: 'cans',
        category: "beverages"
    },
    {
        name: "Canola oil or olive oil",
        quantityUnits: "bottle",
        category: "other"
    },
    {
        name: "Mayonnaise (low calorie)",
        quantityUnits: "bottle",
        category: "other"
    },
    {
        name: "Balsamic",
        quantityUnits: "bottle",
        category: "other"
    },
]
~~~

- En el seed.module importo el ItemsModule y el UsersModule

~~~js
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from './../items/items.module';
import { UsersModule } from './../users/users.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule,
  ]
})
export class SeedModule {}
~~~

- En el seed.resolver

~~~js
import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  
  constructor(private readonly seedService: SeedService) {}


  @Mutation( () => Boolean, { name: 'executeSeed', description: 'Ejecuta la construcción de la base de datos' })
  async executeSeed(): Promise<boolean> {
    
    return this.seedService.executeSeed();
  }
}
~~~

- En el seedService inyecto los rerpositorios y los servicios
- Por ello tengo que exportar el service de items (y el TypeOrmModule si quiero inyectar el repositorio) y el de users
- Entonces, exporto los servicios, importo los módulos
- items.module

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

@Module({
  providers: [
    ItemsResolver, 
    ItemsService
  ],
  imports: [
    TypeOrmModule.forFeature([ Item ])
  ],
  exports: [
    ItemsService,
    TypeOrmModule,
  ]
})
export class ItemsModule {}
~~~

- En user.module

~~~js
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsModule } from './../items/items.module';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ]),
    ItemsModule,
  ],
  exports: [
    TypeOrmModule,
    UsersService
  ]
})
export class UsersModule {}
~~~

- En el seedService importo también el ConfigModule porque usaré la variable de entorno para saber si estoy en producción y no ejecutar el seed
- Debo borrar primero los items por la integridad referencial
- Para el seed, los items necesitan los usuarios para ser insertados
- Necesito los repositorios para crear los builders para impactar en la DB, i borrar los registros 
- Para insertar usuarios SEED_USERS lo recorro con un for y uso el push para meterle cada usuario usando el servicio 
- Para insertar items importo SEED_ITEMS, no voy a usar el await y usaré el Promise.all

~~~js
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_USERS, SEED_ITEMS } from './data/seed-data';

import { Item } from './../items/entities/item.entity';
import { User } from './../users/entities/user.entity';

import { ItemsService } from '../items/items.service';
import { UsersService } from './../users/users.service';


@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,

    ) {
        this.isProd = configService.get('STATE') === 'prod'; //obtengo la variable isProd si esta es igual a prod
    }


    async executeSeed() {
        
        if ( this.isProd ) {
            throw new UnauthorizedException('We cannot run SEED on Prod');
        }

        // Limpiar la base de datos BORRAR TODO
        await this.deleteDatabase();

        // Crear usuarios
        const user = await this.loadUsers();

        // Crear items
        await this.loadItems( user );



        return true;
    }

    async deleteDatabase() {

        // borrar items
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar users
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

    }

    async loadUsers(): Promise<User> {

        const users = [];

        for (const user of SEED_USERS ) {
            users.push( await this.usersService.create( user ) )
        }

        return users[0]; //He dicho que devolvería una promesa de tipo User! retorno el primer resultado del arreglo

    }


    async loadItems( user: User ): Promise<void> { //Aquí devuelvo una Promesa vacía (no hay return)

        const itemsPromises = [];

        for (const item of SEED_ITEMS ) {
            itemsPromises.push( this.itemsService.create( item, user ) ); //al no usar el await usaré el Promise.all
        }

        await Promise.all( itemsPromises );
    }
}
~~~

- Para ejecutar el seed

~~~js
mutation executeSeed{
  executeSeed
}
~~~
----

## README

~~~
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar el proyecto
2. Copiar el ```env.template``` y renombar a ```.env```
3. Ejecutar
```
yarn install
```
4. Levantar la imagen (Docker desktop)
```
docker-compose up -d
```

5. Levantar el backend de Nest
```
yarn start:dev
```

6. Visiar el sitio
```
localhost:3000/graphql
```

7. Ejecutar la __"mutation"__ executeSeed, para llenar la base de datos con información
~~~
