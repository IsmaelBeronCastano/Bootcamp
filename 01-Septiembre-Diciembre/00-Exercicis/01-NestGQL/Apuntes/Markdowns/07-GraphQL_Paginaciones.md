# 07 Nest GraphQL - Paginaciones

- Vamos a trabajar con maestro detalles, muy relacionado con índices, paginaciones, llaves únicas, straingths compuestos
- Es el ejercicio más complejo que hemos hecho hasta ahora, porque hay muchas inserciones, actualizaciones, maneras de trabajar
- Les daremos un montón de flexibilidad a nuestros querys
- Trabajaremos con un usuario con role de admin autenticado

~~~js
mutation login($loginInput: LoginInput!){
  login(loginInput: $loginInput){
    user{
      fullName
    }
    token
  }
}
~~~

- En las variables:

~~~json
{
  "loginInput": {
    "email": "fernando@google.com",
    "password": "123456"
  }
}
~~~

- Copio el token y lo pego en HTTP Headers del playground de Apollo

~~~json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjMTAyMTJhLTIwNzctNGIyMS04YTYxLTE0YWI4MzE4MTExYyIsImlhdCI6MTcxODUxODY2NSwiZXhwIjoxNzE4NTMzMDY1fQ.GSXFcnVdUMv0AA8JntMNX816CbXUMhV1i1KGtHMpN1g"
}
~~~
-----

## Paginar resultados

- No queremos un volcado completo de la data, pierde el sentido de graphQL
- Uso limit para indicar el número de resultados y offset para decirle el número de items que quiero que se salte primero
- Esto viene por los @Args
- No le pongo el ? para hecrlo opcional para TypeScript porque siempre va a tener un valor (por defecto)
- Creo la carpeta common/dto/pagination.args

~~~js
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';


@ArgsType()
export class PaginationArgs {

    @Field( () => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    offset: number = 0;

    @Field( () => Int, { nullable: true })
    @IsOptional()
    @Min(1)
    limit: number = 10;
    
}
~~~

- Vamos al items.resolver

~~~js
@Query(() => [Item], { name: 'items' })
async findAll(
@CurrentUser() user: User,
@Args() paginationArgs: PaginationArgs,
): Promise<Item[]> {

return this.itemsService.findAll( user, paginationArgs);
}
~~~

- En el servicio, - El user.id es un campo compuesto que hay que especificar como se detalla aqui

~~~js
async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {

const { limit, offset } = paginationArgs;
const { search } = searchArgs;

const queryBuilder = this.itemsRepository.createQueryBuilder()
    .take( limit ) //take toma una cantidad de registros
    .skip( offset ) //uso el skip para saltar registros y le mando el offset
    .where(`"userId" = :userId`, { userId: user.id }); //le digo que el userId es igual al parámetro que le paso
                                                        //luego le indico que el valor de este argumento :userId es igual al del id del user que he recibido como parámetro


return queryBuilder.getMany();
}
~~~

- El query sería

~~~js
query findAll{
	items (limit:200, offset:0){
    name
  }
}
~~~

- El dto searchArgs me servirá para buscar por alguna palabra en concreto

~~~js
import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {

    @Field( ()=> String, { nullable: true })
    @IsOptional()
    @IsString()
    search?: string;
}
~~~

- Lo agrego al items.resolver

~~~js
@Query(() => [Item], { name: 'items' })
async findAll(
@CurrentUser() user: User,
@Args() paginationArgs: PaginationArgs,
@Args() searchArgs: SearchArgs,
): Promise<Item[]> {

return this.itemsService.findAll( user, paginationArgs, searchArgs );
}
~~~
- Si coloco el serachArgs antes que el paginationArgs me salta un error.
- Es por algo del class-validator que voy a tener que desactivar en el main
- El forbidNonWhitelisted sirve para que ignorar cuando me mandan más información de la que yo espero en el endpoint
- GraphQl se va a encargar de hacer esta validación por mi
- main.ts

~~~js
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, hay que comentarla 
    })
  );

  await app.listen(3000);
}
bootstrap();
~~~

- En el items.service uso el Like para que el search incluya o sea similar al parámetro 
- Para usar este Like (de la consulta que hay comentada) debería crear un índice especializado
- Los comodines % son para que no importe lo que hay antes y después de la palabra que haya en search
- O grabo todo en lowerCase en la DB o formateo
- Puedo hacerlo como un queryBuilder que es mejor opción
- En el queryBuilder uso LOWER para reducir a minúsculas el name, uso el like para asemejarlo al parámetro de search que quiero como name con  :name. Lo manejo como una variable porque necesito estar seguro de que no lo estoy inyectando directamente en la sentencia SQL
- En un objeto le paso en un template string el search que paso a minúsculas y coloco los comodines

~~~js
async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {

const { limit, offset } = paginationArgs;
const { search } = searchArgs;

const queryBuilder = this.itemsRepository.createQueryBuilder()
    .take( limit )
    .skip( offset )
    .where(`"userId" = :userId`, { userId: user.id }); //le digo que el userId es igual al parámetro que le paso
                                                        //luego le indico que el valor de este argumento :userId es igual al del id del user que he recibido como parámetro
if ( search ) {    //
    queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` });
}

return queryBuilder.getMany();
// return this.itemsRepository.find({
//   take: limit,
//   skip: offset,
//   where: {
//     user: {
//       id: user.id
//     },
//     name: Like(`%${ search.toLowerCase() }%`) quiero que el name sea algo similar o incluya algo como el search, por eso uso Like
//   }
// });
}
~~~

- Si quiero hacer la consulta con el search

~~~js
query findAll{
	items (limit:200, offset:0, search: "Rice"){
    name
  }
}
~~~

- Puedo hacer consultas incluyendo el user

~~~js
query findAll{
	items (limit:200, offset:0, search: "Rice"){
    name
    user{
      itemCount
    }
  }
}
~~~

- Si quiero hacer la consulta de items desde el users ya no funciona por la relación que tenemos
- Nuestros usuarios tienen el campo items que está asociado con la DB
- Quiero romper esa relación automática y definir la forma en la que quiero que estos items se construyan y no decirle a typeorm que lo haga
- Ahora quiero que desde usuarios, automáticamente me cargue un número de items (una paginación)
- de esta manera, en graphQL creamos querys y mutaciones, con campos que podemos ir añadiendo
- Añado paginationArgs y searchArgs al método de users.resolver
- users.resolver

~~~js
  @ResolveField( () => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll( user, paginationArgs, searchArgs );
  }
~~~

- En el items.service usaré el findAll