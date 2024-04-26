# 03 Sección testing NODE_TS HERRERA

- Esta sección trata de hacer testing con las funciones y adaptadores de la sección 1

## Introducción

- El testing no es una pérdida de tiempo
- Las pruebas unitarias estan enfocadas en pequeñas funcionalidades
- Las pruebas de integración están enfocadas en cómo trabajan varias piezas en conjunto
- Tienen que ser fáciles de escribir, leer, confiables, rápidas
- Principalmente se harán unitarias
- Sigue las tres A's
  - A de Arrange (arreglar)
    - Inicializamos variables, realizamos las importaciones necesarias...
  - A de Act (actuar)
    - Aplicamos acciones, estimulos: llamar métodos, simular clicks, realizar acciones sobre el paso anterior... 
  - A de Assert (afirmar)
    - Observar el comportamiento resultante
-----

## Configuración testing


> npm i -D jest @types/jest ts-jest supertest

- Crear archivo de configuración de Jest

> npx jest --init

- Le digo que si al coverage, y v8. Clear mocks (normalmente si pero para aprender no)

- En jest.config.js

~~~js
preset: 'ts-jest',
testEnvironment: "jest-environment-node",

//opcional
setupFiles: ['dotenv/config']
~~~

- Scripts:

~~~json
"test": "jest",
"test:watch":"jest --watch",
"test:coverage": "jest --coverage"
~~~

- Pequeña prueba: creo la carpeta src/test/app.test.ts
- app.test.ts

~~~js
describe('App', ()=>{
    it('should be true', ()=>{
        expect(true).toBe(true)
    })
})
~~~

- Ejecutar con npm run test
- Puede ser que en el futuro de un error en el que diga que el jest.config.ts está fuera del rootDir (o similar)
- Añade esto antes del compilerOptions, dentro del objeto JSON del tscongif

~~~json
{
  "include": ["src/**/*"],
  "exclude":  ["node_modules", "**/*/spec.ts", "**/*/test.ts"],
  "compilerOptions": {
 }}
~~~
------

## Arrange, Act y Assert

- **AAA**
  - **Arrange**: preparación de lo que se va a probar
  - **Act**: procedimiento en el que aplico algún tipo de estímulo, estoy probando algo. La acción
  - **Assert**: la evaluación, que es lo que voy a confirmar

~~~js
test("Should be 30", ()=>{
    
    //Arrange
    const num1 = 10
    const num2 = 20
    
    //Act
    const result = num1+num2
    
    //Assert
    expect(result).toBe(30)
})
~~~

### Pruebas en 01-template

- Creo la misma estructura que mi filesistem en la carpeta test. En lugar de crear otra carpeta src, trato la carpeta test como si fuera src

~~~js
import { emailTemplate } from "../../js-foundation/01-template"

describe("js-foundation/01-template.ts", ()=>{

    test('emailTemplate should contain a greeting', ()=>{
        
        //Evalúo que tenga la palabra Hi
        expect(emailTemplate).toContain('Hi, ')
    })

    test('emailTemplate should contain {{name}} and {{orderId}} ', ()=>{
        
        //uso una expresión regular
        expect(emailTemplate).toMatch(/{{name}}/)
        expect(emailTemplate).toMatch(/{{orderId}}/)
    })
})
~~~

### 02-destructuring

- Exporto el arreglo de personajes para probar algo
- Pongamos que el orden no me importa, solo quiero determinar que el arreglo contenga Flash

~~~js
import { characters } from "../../js-foundation/02-destructuring";


describe("js-foundation/02-destructuring.ts", ()=>{
    test("characters should contain Flash", ()=>{

        //debe contener Flash
        expect(characters).toContain('Flash')
    })

    test("Flash should be the first character", ()=>{

        //el primero debe ser Flash y el segundo Superman
        const [flash, superman] = characters
        expect(flash).toBe('Flash')
        expect(superman).toBe('Superman')

    })
})
~~~

### 03-callbacks

- getUserById recibe un id y un callback
- El callback puede recibir un error y un user

~~~js
export function getUserById( id: number, callback: (err?: string, user?:User) => void ) {
  const user = users.find( function(user){
    return user.id === id;  
  });

  if( !user ) {
    return callback(`User not found with id ${id}`);
  }

  return callback( undefined, user );
}
~~~

- Puedo probar que si le mando el id que existe me devuelva el user
- Si da error estaría esperando que el usuario sea nulo
- Por el scope, el test termina antes de ejecutar el callbacks 
- Debo decirle al test que espere a que tener una resolución positiva o negativa del callback
- Se usa el **done** como argumento que da origen al test 
- *NOTA* si coloco un setTimeOut en el getUserById el test esperará a que finalice si pongo **done**
- Hay que llamar al done cuando ya se que tengo los resultados

~~~js
import { getUserById } from "../../js-foundation/03-callbacks"



describe("js-foundation/03-callbacks.ts", ()=>{                         //uso del done para el callback
    test("getuserById should return an error if user does not exists", (done)=>{
        const id = 10
                        //TS no me obliga a especificarlos porque ambos pueden ser nulos
        getUserById(id, (err, user)=>{
            expect(err).toBe(`User not found with id ${id}`)
            expect(user).toBe(undefined)
        
          done() //le dioa a jest no termines la prueba hasta que llame al done
        })

    })

})
~~~

- En este caso de éxito, para comparar un objeto toBe no sirve porque no apunta al mismo lugar en memoria
- Usaremos toEqual o toStrictEqual

~~~js
test("getUserById should return John Doe", (done)=>{
    const id= 1

    getUserById(id, (err, user)=>{
        expect(err).toBeUndefined()
        expect(user).toEqual({
            id: 1,
            name: "John Doe"
        })
        done()
    })
})
~~~
------

## Pruebas en 05-Factory

- Por ahora no me interesa que el uuid y la fecha de nacimiento sea la correcta
- Pruebo que devuelva una función

~~~js
import { buildMakePerson } from "../../js-foundation/05-factory";

describe('Factory', () => {

    const getUUID = ()=>'1234'
    const getAge= ()=> 35

    test('buildMakePerson should return a function', () => {

    const makePerson = buildMakePerson({getUUID, getAge})        

    expect(typeof makePerson).toBe('function')
    })
})
~~~

- No te preocupes por tener el 100% del codigo cubierto por el testing
- Probemos que retorna a una persona
- Esto comprueba que en el id de retorno de la persona también retorne el llamado a la función getUUID

~~~js
test('Should return a person', ()=>{

    const makePerson= buildMakePerson({getUUID, getAge}) //pruebo también la inyección de la dependencia getUUID y getAge             
    const JohnDoe= makePerson({name:'John Doe', birthdate: '1985-10-21'})
    
    //console.log(JohnDoe)
    
    expect(JohnDoe).toEqual({
        id:'1234',
        name:'John Doe',
        birthdate:'1985-10-21',
        age:35
    })  
})
~~~
------

## 06-Promises


~~~js
import { httpClient as http} from "../plugins";

export const getPokemonById = async( id: string|number ):Promise<string> => {
  const url = `https://pokeapi.co/api/v2/pokemon/${ id }`;

  const pokemon = await http.get( url );

  // const resp = await fetch( url );
  // const pokemon = await resp.json();


  // throw new Error('Pokemon no existe');
  
  return pokemon.name;
  
  // return fetch( url )
  //   .then( ( resp ) => resp.json())
  //   // .then( () => { throw new Error('Pokemon no existe') })
  //   .then( ( pokemon ) => pokemon.name );

}
~~~

- Incluyo el httpClient

~~~js
import axios from 'axios';


export const httpClientPlugin = {

  get: async(url: string ) => {
    const { data } = await axios.get( url );
    return data;
    // const resp = await fetch( url );
    // return await resp.json();     
  },

  post: async(url: string, body: any ) => {},
  put: async(url: string, body: any) => {},
  delete: async(url: string ) => {},

};
~~~

-  Podríamos hacer la prueba con hhtp client, mandarle un mock para simular un mensaje de éxito
-  Podemos probar el resultado de la llamada real a pokeapi.co
- A veces voy a querer configurar una db ficticia para crear, borrar, etc
- Cuanto más desacoplado sea el código es más fácil de testear
- Es más fácil probar segmentos pequeños de código
- Probemos primero la situación de existo, debe regresar un pokemon
- Para trabajar con promesas puedo hacer el callback async

~~~js
import { getPokemonById } from "../../js-foundation/06-promises"

describe('06-Promises', ()=>{


    test("Should return a pokemon", async()=>{

        const pokemonId = 1

        const pokemonName = await getPokemonById(pokemonId)

        expect(pokemonName).toBe('bulbasaur')

     })
})
~~~

- Ahora en caso de que no devuelva un pokemon debe mostrar un error
- Debo manejar el error en 06-promises

~~~js
import { httpClient as http} from "../plugins";

export const getPokemonById = async( id: string|number ):Promise<string> => {
  
  try {
    
    const url = `https://pokeapi.co/api/v2/pokemon/${ id }`;
  
    const pokemon = await http.get( url );
    
    return pokemon.name;

  } catch (error) {
    
    throw 'Pokemon no existe!';
    
  }  
  // const resp = await fetch( url );
  // const pokemon = await resp.json();


  
  
  // return fetch( url )
  //   .then( ( resp ) => resp.json())
  //   // .then( () => { throw new Error('Pokemon no existe') })
  //   .then( ( pokemon ) => pokemon.name );

}
~~~

- Espero que me devuelav la excepción
- Puedo usar un try catch en el test y asegurarme que vaya al catch

~~~js
test('Should return an error if pokemon does not exists', async()=>{
      const pokemonId=12345678
      

      try {
          const pokemonName= await getPokemonById(pokemonId)
          expect(true).toBe(false) //esto siempre dará error 
          
      } catch (error) {
          expect(error).toBe('Pokemon no existe!')
      }

})
~~~
------

## Pruebas en getAge plugin

~~~js
export const getAge = ( birthdate: string ) => {

  // return getAgePlugin(birthdate);
  return new Date().getFullYear() - new Date(birthdate).getFullYear();
}
~~~

- Yo esperaría que esto funcionara

~~~js
import { getAge } from "../../plugins"

describe("get-age.plugin", ()=>{

    test('getAge() should return the age of a person', ()=>{

        const birthDate = '1981-06-30'

        const age = getAge(birthDate)

        expect(age).toBe(43)
    })

})
~~~

- Y si, pasa. Pero el año que viene no pasará
- De todas maneras, el código de la función getAge faltaría estar más elaborado
- Por ejemplo hacer una comprobación que el tipo de retorno sea una fecha
-Para que el test sea atemporal puedo hacerlo así

~~~js
test('getAge should return current age', ()=>{
    
    const birthDate = '1981-06-30'

    const age = getAge(birthDate)

    const calculatedAge = new Date().getFullYear() - new Date(birthDate).getFullYear();

    expect(age).toBe(calculatedAge)
})
~~~
-----

## SpyOn - métodos de objetos

- Puedo simular que el resultado del método getfullYear sea 2020
- Con spyOn puedo cambiar el ADN llamando a la propiedad.protoype y el método que quiero mockear

~~~js
test('getAge() should return 0 years', ()=>{
    const spy = jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(1995)

    const birthdate = '1995-01-01'

    const age = getAge(birthdate)

    console.log(spy) // para ver los tipos de mock que hay

    expect(age).toBe(0)

    //el spy no solo sirve para hacer un mock
    //puedo comprobar si la función ha sido llamada
    expect(spy).toHaveBeenCalled()
    //expect(spy).toHaveBeenCalledWith() serviría para indicar que getFullyear fue llamado con algún argumento
})
~~~
-----

## Pruebas en GetUUID Adapter

- No me interesa probar que uuid funciona bien porque ya está altamente probado
- Lo que me interesa probar es que la función funcione como se espera

~~~js
import { getUUID } from "../../plugins"

describe('get-id.plugin', ()=>{
    
    test('getUUID should return a uuid', ()=>{
        const uuid = getUUID()

        expect(typeof uuid).toBe('string')
        expect(uuid.length).toBe(36)
    })
})
~~~
-----

## HttpClient Adapter

- La mejor estrategia para testing es evaluar pieszas pequeñas para que cuando se vaya a evaluar una pieza grande todas las demás estén evaluadas

~~~js
import axios from 'axios';


export const httpClientPlugin = {

  get: async(url: string ) => {
    const { data } = await axios.get( url );
    return data;
    // const resp = await fetch( url );
    // return await resp.json();     
  },

  post: async(url: string, body: any ) => {
    throw new Error('not implemented')
  },
  put: async(url: string, body: any) => {
    throw new Error('not implemented')
  },
  delete: async(url: string ) => {
    throw new Error('not implemented')
  },

};
~~~

- post, put y delete no están implementados
- Es conveniente lanzar un new Error('not implemented')
- En modo watch pulso w y luego la p para filtrar y pongo http para hacer las pruebas solo en http-client
- Apunto al endpoint con POSTMAN/THUNDERCLIENT y copio el objeto para equipararlo en el test

~~~js
import { httpClientPlugin } from "../../plugins/http-client.plugin"

describe('http-client adapter', ()=>{

    test('httpClientPlugin.get() should return a string', async()=>{

        const data = await httpClientPlugin.get('https://jsonplaceholder.typicode.com/todos/1')
        
        expect(data).toEqual({
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        })
    })
})
~~~

- Puedo colocar que espere un boolean en completed con

~~~js
"completed": expect.any(Boolean)
~~~

- Evalúo que tenga las funciones post, put y delete

~~~js
import { httpClientPlugin } from "../../plugins/http-client.plugin"

describe('http-client adapter', ()=>{

    test('httpClientPlugin.get() should return a string', async()=>{

        const data = await httpClientPlugin.get('https://jsonplaceholder.typicode.com/todos/1')
        expect( data).toEqual({
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        })
    })

    test('httpClient should have POST, PUT and DELETE methods', async ()=>{
        
        expect(typeof httpClientPlugin.post).toBe('function')
        expect(typeof httpClientPlugin.put).toBe('function')
        expect(typeof httpClientPlugin.delete).toBe('function')

        
    })
})
~~~

- Podría evaluar si reciben argumentos pero no tiene sentido si no los están usando
-----

## Logger Adapter

- Lo que tengo que evaluar es el producto resultante

~~~js
import winston, { format } from 'winston';

const { combine, timestamp, json } = format;


const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json(),
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

export const buildLogger = (service: string ) => {

  return {
    log: (message: string) => {
      logger.log('info', {message, service});
    },
    error: (message: string ) => {
      logger.error('error', {
        message, 
        service,
      });
    }
  }
}
~~~

- Probar un logger es dificil
- No esperamos un return si no que se imprima un log
- Hay que probar que se llamen los métodos que se espera
  - Hablando del logger de winston, voy a asegurarme de que el logger haya sido llamado con los argumentos adecuados, o con algún valor
  - No voy a probar que ejecute la construcción, cree los archivos...
  - Lo que me interesa es que haya sido llamado con el servicio esperado y que tenga los métodos log y error en particular
  - Podría inetersarme evaluar otras cosas...
- Evalúo que logger devuelva la funciones log y error

~~~js
import { buildLogger } from "../../plugins"

describe('logger.plugin', ()=>{

    test('buildLogger should return a function logger', ()=>{

        const logger = buildLogger('test')

        expect(typeof logger.log).toBe('function')
        expect(typeof logger.error).toBe('function')
    })
})
~~~

- Esto nos asegura que siempre tenga la función .log (¡y que sea una función!)
- Para evaluar que el logger ha sido llamado hay muchas formas de hacer un mock al respecto (un mock de winston)
- No me interesa hacer un mock completo, solo que ha sido llamado
- Para ello exporto el logger del archivo original
- Podría evalauar muchas cosas del logger pero lo que me interesa es usar el espía para comprobar que ha sido llamado

~~~js
import { buildLogger, logger as winstonLogger } from "../../plugins"

describe('logger.plugin', ()=>{

    test('buildLogger should return a function logger', ()=>{

        const logger = buildLogger('test')

        expect(typeof logger.log).toBe('function')
        expect(typeof logger.error).toBe('function')
    })

    test('logger has been called', ()=>{
        //preparación
        const winstonLoggerMock= jest.spyOn(winstonLogger, 'log')
        const message = 'test message'

        const service= 'test service'

        //estímulo
        const logger = buildLogger(service)

        logger.log(message)

        //aserciones
        expect(winstonLoggerMock).toHaveBeenCalled()

    })
})
~~~

- Podría usar el toHaveBeenCalledWith({}) y pasarle un objeto vacío, en consola me indicará todos los valores como info, otro objeto con contros valores
- Puedo comprobar que ha sido mandado con esos valores copiando de la respuesta de error
------

## testing Coverage

> npm run test:coverage

- Da un resumen general del código evaluado
- En la carpeta coverage hay un html dinámico (doble click)
- Es recomendable que esté por encima del 70% cubierto
- Si el testing falla puedo prevenir el build de producción
-----

## Build + testing

- Para evitar que haga el build si algún test falla
- Instalo rimraf
- En el package.json

~~~json
{
  "build": "npm run test && rimraf ./dist && tsc",
  "start": "node dist/app.js"
}
~~~

