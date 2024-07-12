# CURSO TYPESCRIPT 1

- Para transformar un archivo a módulo y que Typescript no confunda las variables dentro del scope de otros archivos coloco export default {}
- Si dentro coloco un método podré usarlo con la notación por punto

~~~js
export default{
    metodo
}

//otro archivo

import basics from './basics.ts'

basics.metodo()
~~~

## ?

- Para hacer un parámetro opcional en un objeto debo declarar los tipos primero para poder usar **?**

~~~js
let objeto:{
    name: string;
    lastName?: string } = {
    name: "María"
}
~~~
- Puedo usar ? en expresiones para que en caso de ser undefined o null no de error

> Objeto.propiedad?.toLowerCase()

## typeof

- Si quiero usar el autocompletado cuando tengo más de una opción en el tipado puedo usar **typeof**

~~~js
function funcionPrimaria(id: string | numero){
    if(typeof id === "string"){
        id.toLowerCase()
    }
}
~~~

- Si tengo un array no puedo usar typeof

~~~js
function funcionArray(people: string | string[]){
    if(Array.isArray(people)){
        return "is an Array"
    }else{
        return "is a string"
    }
}
~~~

## Tipos

- Puedo crear tipos con **type**

~~~js
type Id = string | number

function funcionPrimaria(id:Id){}

//Puedo usar template strings

type Protocol = "http" | "https"
type TLD = "com" | "io" | "org" | "es"

type Url = `${Protocol}://${string}.${TLD}`
~~~

## Interfaces

- Extendemos las interfaces con **extends**

~~~js

interface Teacher {
    name: string;
    lastname: string
}

interface MathTeacher extends Teacher{
    matter: string
}

const teacherInfo: Teacher ={
    name: "Jhon",
    lastName: "Carpenter"
}
~~~

## Extender tipos

- Para extender tipos uso **&**. Para objetos se recomienda usar interfaces, para el resto tipos
- Para extender se recomienda usar interfaces
- 
~~~js
type User = {
    name: string
}

type Student = User &{
    goodStudent: boolean
}
~~~

## as

- Para decirle a Typescript "yo se más que tu, se de que tipo es" uso **as**

~~~js
const userInput = document.getelementById("user")

//Si dejo que Typescript infiera por mi el tipo será un HTML element genérico por lo que
//no podré acceder a value que es del tipo HTMLInputElement

//Para ello uso as

if(userInput)
const castUserInput = userInput as HTMLInputElement

castuserInput.value;
//Puedo hacerlo directamente en la declaración. Uso también null para que si lo fuera no me de error

const userInput = document.getelementById("user") as HTMLInputElement | null

//Esto me obliga a usar if como en el caso anterior, para comprobar que no es null y poder acceder 
//a .value
~~~

~~~js
let name= "Mire"

if(name === "Strange") // esto no da error porque es de tipo string

//Si en lugar de usar let uso const si da error, porque entonces name es de tipo literal "Mire"

//Puedo asignar tipos literales ( no solo string, number...)

type Direction = "Left" | "Right

function chooseDirection(direction:Direction){

}

chooseDirection("Left"); //Solo me deja Left o Right
~~~

- A veces a Typescript se le va la olla y no marca los errores. Haciendo un pequeño cambio y guardando aparecen
- En este caso pasa algo parecido

~~~js
type MethodRequest = "GET" | "POST"

function peticionWeb(url: string, method: MethodRequest){}

const req = {
    url: "urlRandom",
    method: "GET" 
}

peticionWeb(req.url,req.method)// req.method da error

//Puedo usar as para que lo tome como valor literal y no tipo string

peticionWeb(req.url,req.method as "GET")

//Puedo tambien usar as const en el objeto para que lo tome como valor literal

const req = {
    url: "urlRandom",
    method: "GET" 
} as const

//Si quiero que solo pase con method y no con url

const req = {
    url: "urlRandom",
    method: "GET" as const 
}
~~~

# !

- Para decirle a Typescript que el valor seguro no va a ser null puedo usar **!**

~~~js
function doSomething(something: string | null){
    parseInt(something!)
}
~~~

- De esta manera, con la exclamación no me da error el parseInt ya que le aseguro que no es null

## Funciones

- En este nuevo caso le paso una función que lleva como parámetro un string y devuelve un boolean

~~~js
function whatever(fn: (arg: string)=> boolean){

}

//Puedo usar rest, para ello debo declararlo como un string porque Typescript lo detecta como tal

function whatever2(...args: string[]){}

//Si la función no devuelve nada uso void

function whatever3(parameter: string): void {}

//Puedo usar desestructuracion

interface User {
    id: string;
    name: string
}

function userSearch({id, name}: User){
    console.log(id, name)
}
~~~

## Never

- El tipo never se usa en el caso de que no puedan haber más parámetros

~~~js
type UserName = "Carlitos" | "Snoopy" | "Mafalda"

function invalidName(name: never){
    throw new Error("")
}

function cualquiera(name: UserName){
    switch(name){
        case "Carlitos":
            return "Es Carlos";
        break;
        case "Snoopy":
            return "is Snoopy!";
        break;
        case "Mafalda":
            return "Oh, Mafalda!"
        default:
            invalidName(name)      //En este caso no va a entrar nunca.
            break;                  //Pero si añado un nuevo nombre a UserName me dará error
    }
}
~~~

## Clases

~~~js
class User {
    name: string; // Si name no tiene un valor por defecto y no tiene un constructor dará error
    
    constructor(name: string){
        this.name = name
    }

}

class Student {
    constructor(name: string){
        super(name) //Llamo al constructor padre
    }
}

//Para implementar una interfaz

interface Animal {
    name: string;
    move(): void
}

class Dog implements Animal{
    name: string;
    move(){

    }
    constructor(name: string){
        this.name = name
    }
}

//public es por defecto. La propiedad es accesible desde cualquier sitio.
//La propia clase, subclases, etc

class Teacher{

    public courses = [""]
    protected UploadCourses() {} //protected es solo utilizable por las subclases
    private id = 1; //Con private no se puede acceder desde fuera
                    //Solo es accesible dentro de la clase Teacher
}

new Teacher().courses;

new Teacher().id; // esto da error. id es solo accesible para uso dentro del código de Teacher

//Puedo saber si es una instancia de Teacher con insteanceof

const Manu = new Teacher();

if(Manu insteanceof Teacher){
    console.log("yes")
}
~~~

