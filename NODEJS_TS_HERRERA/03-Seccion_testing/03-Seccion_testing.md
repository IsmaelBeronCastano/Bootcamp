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
- 

~~~js
~~~