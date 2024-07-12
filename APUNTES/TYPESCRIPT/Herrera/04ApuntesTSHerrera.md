# 04 TYPESCRIPT HERRERA

## Decoradores

- Los decoradores pueden ponerse en linea o en linea múltiple
- No son más que una función que se utiliza para añadir o expandir la funcionalidad de un objeto

~~~ts
@aksj @poaa
sale();

@aksja
@aksj
sale()
~~~

- Es raro necesitar crear un propio decorador
- Pueden recibir parámetros (Factory Decorators)

~~~ts
@Component({
    selector: 'app-product',
    templateUrl: './products.html',
    styleUrls: ['./products.css']
}) 
~~~

- En Nest se pusieron muy de moda, casi todo se hace con decoradores y clases
- Si le quitas los decoradores te queda una clase y una función
  
~~~ts
@Controller('cats')
export class CatsController{
   
   @Get()
   findAll(): string {
        return 'This action return all cats'
    }
}
~~~
------

## decoradores de clases

- Los decoradores de clases son más sencillos que los de métodos y propiedades que tienen más parámetros
- Para usar los decoradores en tsconfig experimentalDecorators: true

~~~ts
//creo mi decorador

function printToConsole(constructor: Function){
    console.log(constructor)
}

@printToConsole
export class Pokemon{
public publicApi: string = 'https://pokeapi.co'

    constructor(public name: string)
}
~~~

- Este decorador imprime toda la clase. Se ejecuta en el momento que se define la clase
- Se ejecuta aunque yo no tenga ninguna instancia de la clase
-----

## Factory Decorators

- Si quiero recibir argumentos no puedo usar la fórmula anterior para hacer un decorador
- Para ser un Factory Decorator debe retornar una función
~~~js
const printToConsoleCondicional = (print: boolean = false): Function =>{
    if(print){
        return printToConsole; //retorno la función, no la ejecuto. Paso la referencia
    }else{
        return ()=> console.log("No imprime")
    }
}

@printToConsoleCondicional(true)
export class Pokemon{
public publicApi: string = 'https://pokeapi.co'

    constructor(public name: string)
}
~~~
-----

## Ejemplo de un decorador - Bloquear prototipo

- Voy a crear un decorador que me sirva para bloquear el prototipo de una clase y no se pueda expandir

~~~js
const bloquearPrototipo = function(constructor: Function){
    //seal es una propiedad que previene la modificacion de los atributos y adicionar nuevas propiedades
    Object.seal(constructor)
    Object.seal(constructor.prototype)
}

@bloquearPrototipo   //los decoradores son funciones que se ejecutan en tiempo de transpilación
@printToConsoleCondicional(true)
export class Pokemon{

public publicApi: string = 'https://pokeapi.co'

    constructor(public name: string)
}

const charmander = new Pokemon('Charmander')

//NO ME DEJA, ERROR
(Pokemon.prototype as any).customName = 'Pikachu' //Intento expandir su prototipo añadiendo una nueva propiedad
                                                //coloco as any para que no importe el tipo pero he bloqueado añadir propiedades
~~~

- Sin @bloquearPrototipo todas las clases Pokemon tendrían customName = 'Pikachu'
-----

## Decoradores de métodos

- 
~~~ts
@printToConsoleCondicional(true)
export class Pokemon{
public publicApi: string = 'https://pokeapi.co'

    constructor(public name: string)
        //No hay pokemons negativos ni con el id 5000
    savePokemonToDB(id: number){
        console.log(`Pokemon Saved in to DB ${id}`)
    }
}
~~~

- Puedo hacer un decorador para hacer la validación que el id esté en un rango de 1 a 800
- Se suele apuntar a hacer FactoryDecorators porque no se sabe si en un futuro vamos a necesitar más parámetros

~~~ts
function checkValidPokemonId(){

    //como decorador de método se va a disparar con varios argumentos.
    //target depende de lo que coloque, propertykey el nombre del método que estoy decorando, y el descriptor
    return function(target:any, propertyKey:string, descriptor: PropertyDescriptor){
        console.log({target, propertyKey, descriptor})
    }
}
~~~

- Se lo coloco al método savePokemonToDB
- Puedo ver en consola que
  - propertyKey: savePokemonToDB    -> apunta a lo que esta decorando
  - descriptor: permite ponerlo solo lectura o escritura. Puede servir si se quiere hacer solo readonly
  - target: constructor: class Pokemon   -> tengo acceso a la clase
- Lo que quiero es controlar que el id este entre 1 y 800
  
~~~ts
function checkValidPokemonId(){

    return function(target:any, propertyKey:string, descriptor: PropertyDescriptor){
        //al ejecutar esta función no se ejcuta el console.log del método savePokemonToDB
        //descriptor.value = ()=> console.log("Hola mundo")

        //Si coloco una función en el descriptor.value, se va a ejcutar con los argumentos que haya en el método (en este caso el id)

        const OriginalMethod = descriptor.value // necesito declararlo para poder ejecutarlo en el else. No pasa por referencia

        descriptor.value= (id: number) =>{
            if(id < 1 || id > 800){
                return console.error("El id del Pokemon debe estar entre 1 y 800)
            }else{
                OriginalMethod(id)
            }
        }
    }
}
~~~

- Ahora solo salva en la DB si el id de Pokemon está entre 1 y 800
----

## Decoradores de propiedades

- para los decoradores se suele usar function para poder usar this 
- Voy a crear un decorador para bloquear el publicApi de la clase Pokemon y sea solo readonly
- A pesar de ponerle private a publicApi puedo acceder desde cualquier instancia y cambiarlo (aunque Typescript se queje)
- Pongamos que lo quiero public pero no quiero que nadie lo pueda cambiar, que sea solo lectura
- El descriptor solo lo tengo disponible si decoro un método
- De hecho la lògica al decorar una propiedad es crear el objeto de descriptor (un PropertyDescriptor)
~~~ts
function readonly(isWritable: boolean = true): Function{
    return function(target: any, propertyKey: string){
     
     const propertyDescriptor: PropertyDescriptor = {
        get(){
            console.log(this, "getter") //cuando intento acceder a la propiedad publicApi se dispara "getter", QUE RARO!
            return "Miguel" //de esta manera le caigo a la propiedad publicApi y ahora vale "Miguel"
        },
        set(this, value){ //accedo al this, que es la instancia de la clase y al value que es a lo que estoy intentando establecer
            //si esta en modo lectura no debería poder accederse al set
            Object.defineProperty(this, propertyKey, {     //el tercer argumento es un descriptor!
                value: value, // el value por defecto va a ser el value que estoy recibiendo en el set.
                            //solo la primera vez que se ejecute esto se va a poder escribir
                writable: !isWritable, //si quiero que sea solo lectura le pasaré un false 
                enumerable: false // lo pongo en false para que no se pueda ver!
            })
        }
     }  
     return descriptor; 
    }
}
~~~

- Rara vez te vas a sentar a crear decoradores. Vas a usar los previamente creados, es lo más habitual