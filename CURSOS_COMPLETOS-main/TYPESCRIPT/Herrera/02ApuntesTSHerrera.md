# 02 TYPESCRIPT HERRERA

## Interfaces

- Interfaces y tipos son muy parecidos. 
- Las interfaces son más facilmente extensibles
    - Muy usadas con peticiones http
- Los tipos son más usados con patrones como redux para definir que tipo de acciones son permitidas a un objeto

## Estructuras complejas

~~~ts
interface Client{
    name: string;
    age?: number;
    address?:{        //No se recomienda tener más de un nivel en una interfaz
        id: number;
        zip: string
    }
}
////////////////////////////////////////////////////////////

interface Client{
    name: string;
    age?: number;
    address: Address  // de esta manera está la interfaz está solo a un nivel sin identación, lo recomendable
}

interface Address {
    id: number;
    zip: string
}


const client: Client ={
    name: "Manuel",
    age: 25,
    address:{
        id: 125,
        zip: 'KYD'
    }
}
~~~

## Métodos en las interfaces

- En las interfaces los métodos se definen distinto que en los tipos
- Si en los tipos lo definirias getFullName(id: string)=> void
- En una interfaz se utilizan los dos puntos

~~~ts
interface definirMetodo{
    name: string;
    getFullName(id: string): void
}
~~~

- Cualquiera que implemente la interfaz debe tener un name y un metodo getFullName

## Interfaces en las clases

~~~ts
interface Xmen{
    name: string;
    realName: string;
    mutantPower(id: number): string
}

interface Human{
    age: number
}

class Mutant implements Xmen, Human {
    public age: number;
    public name: string;
    realName: string;

    mutantPower(id: number){
        return `${this.name}`
    }
}
~~~

## Interfaces para las funciones

~~~ts
interface addTwoNumbers{
    (a: number, b: number): number  //función que recibe dos números y devuelve un número
}



let addNumbersFunction: addTwoNumbers = (x:number = 1, y: number = 2)=>{
    return x + y
}
~~~

# Namespaces

- Normalmente se usan más en la parte del desarrollo del propio framework, no tanto en el desarrollo front o back
- El NameSpace sirve de agrupador para poder usar su contenido en cualquier otro lado

~~~ts
namespace Validations{

    //para poder llamar a los métodos del NameSpace debo usar export

    export const validateText = (text: string): boolean=>{
       return (text.length > 3)? true: false
    }
    export const validateDate=(fecha: Date): boolean =>{
        return ( isNaN(fecha.valueOf())) ? false : true //si no es un número regreso un false
    }
}

console.log(Validations.validateText("Miguel")) //devuelve true
~~~

- La idea de estos NamSpaces es tener en un lugar agrupado toda una lógica
- Se puede ver como una clase, solo qeu el NameSpace puede agrupar infinidad de clases dentro suyo
- Se usan bastante en creación de frameworks y librerías
----

##
