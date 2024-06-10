# 02 NEST Duro de Roer - SWAGGER

- Instalación

> npm i @nestjs/swagger swagger-ui-express


- En el main añado

~~~js
async function bootstrap(){
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('Names API')
        .setDescription('CRUD names')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    
    SwaggerModule.setup('documentation', app, document)

await app.listen(3000)
}
bootstrap()
~~~

-*DocumentBuilder* y *SwaggerModule* vienen de @nestjs/swagger
- No hace falta importar este modulo en app.module
- La documentación está en la url documentation (como puse en SwaggerModule.setup)

> http://localhost:3000/documentation

- Aparecen todos los endpoints
-----

## ApiTags

- Debajo de **@Controller()** coloco el decorador **@ApiTags('names')** de @nestjs/swagger
- Separaría cada módulo en la documentación con **@ApiTags('otro_modulo')**
- Si quito el .spec, .controller y .service del app (que no me sirven de nada) desaparece el default de la documentación y queda solo names
------

# ApiOperation

- En el controller, debajo de **@Post** coloco **@ApiOperation**
```js
@Post()
@ApiOperation({
    description: "Crea un nuevo usuario. Retorna true si se inserta correctamente"
})
```
- Hago lo mismo con el resto de endpoints
-----

## ApiParam

- Lo usaremos para documentar los parámetros del PUT y el DELETE por nombre
```js
@Put()
@ApiParam({
    name: 'name',
    type: 'string',
    description: 'Nombre original'
})
@ApiParam({
    name: 'newName',
    type: 'string',
    description: 'Nombre nuevo'
})
```
----

## ApiQuery

- Lo usaré para el query del getNames que era start
- Debo indicarle que no es obligatorio porque por defecto me marcará que lo es
```js
@Get()
@ApiQuery({
    name: 'start',
    type: 'string',
    required: false,
    description: 'Nombres que empiecen por el query'
})
```
-----

## ApiBody

- Puedo añadir una descripción al **@Body** de createNames
```js
@Post()
@ApiBody({
    description: 'Añadiendo un nombre',
    examples:{
      value:{
        name: 'Migue'
      }
    }
})
@ApiOperation({
    description: "Crea un nuevo usuario. Retorna true si se inserta correctamente"
})
```
- En examples podría poner **ejemplo1**: {values:{name:'Miguel}}
--------

