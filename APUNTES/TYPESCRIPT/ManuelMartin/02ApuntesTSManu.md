# 02 Typescript

## Tipado avanzado de objetos

~~~js
interface User {
    username: string;
    readonly birthDate: string; //La fecha de nacimiento del usuario no va a cambiar. Por eso uso readonly
}

const user: User ={
    username: "Rie",
    birthdate: "1997"
}

user.birthDate = //Me da error, no puedo cambiar birthDate

// Se que todas las propiedades de Teacher van a ser de tipo número

interface Teacher {
    [key:string]: number
}

const teacher:Teacher ={
    propiedad: 1,
    propiedad2: 2,
    propiedad3: "Esto es un string" //Esto da error
}
~~~

## Satisfies

~~~js
type CourseId = string | number;

interface Course {
    id: CourseId;
    title: string;
    description: string;
    students: number
}

interface User{
    id: string;
    name: string;
    courses: Course[] | string[] //Puede tener un arreglo de tipo Course o de strings
}

const myUser: User ={
    id: "ssdsd",
    name:"Migue",
    courses:[{
        id:"1212",
        title: "Titulo",
        description:"Description",
        students: 2
    },
    {
        id:"3232",
        title: "Titulo2",
        description:"Description2",
        students: 2
    }]
}

myUser.courses.forEach(course=> console.log(course.title)) 
//course.title me da error porque course sigue la interfaz, puede ser un array de Courses o de strings
 
//Yo tengo claro que es de tipo Course, uso satisfies. Le quito la implementación de la interface a
//la declaración y se la añado con el satisfies al final


const myUser ={
    id: "ssdsd",
    name:"Migue",
    courses:[{
        id:"1212",
        title: "Titulo",
        description:"Description",
        students: 2
    },
    {
        id:"3232",
        title: "Titulo2",
        description:"Description2",
        students: 2
    }]
} satisfies User

//Ahora detecta el tipo (lo infiere Typescript) y ya tengo autocompletado de course. y no me da error
//Si pongo un array de strings Typescript me avisa que no puedo usar .id, etc
~~~

## Genericos en funciones

~~~js

//Esto va a funcionar con cualquier tipo de valor pero tiene un coste

function filterValues(search: any, values: any[]){
    values.filter(value => value === search)
}

const foundValues = filterValues("Migue", ["Migue", "Perico", "Clara"]) // como es de tipo any no reconoce
                                                                        // que es una array de strings

//hay una forma  que es

const foundValues = filterValues("Migue", ["Migue", "Perico", "Clara"]) as string[] 

//pero hay otra mejor que es usar un genérico para expresar que puede ser de un tipo u otro

function filterValues<T>(search: T, values: T[]):T[]{  //devuelve un array de genérico, en el ejemplo string

    values.filter(value => value === search)
}

const foundValues = filterValues<string>("Migue", ["Migue", "Perico", "Clara"])

//Ahora search va a equivaler a string y values también
~~~

## Genericos en tipos

- Quiero generar varios tipos que van a compartir ciertas propiedades ( un id, createdAt,updatedAt) 

~~~js
 type DBRecord<T> ={
    id: number;
    createdAt: Date;
    updatedAt: Date;
    data: T
 }

type User =DBRecord<{name: string; username: string}>

//Ahora a data le está asignando el tipo que yo le he pasado, name y usernames strings

type Course = DBRecord<{title: string; description: string}>

//Ahora tiene otro tipo de data
~~~

## Genéricos con constrains

- Los constrains sirven para limitar los valores que le puedo pasar a un genérico

~~~js

type UserData<T>={
    username: T
}

type MyUserData = UserData<string> //username sería de tipo string

//Pongamos que quiero limitar el genérico a string o a un objeto que tenga un name y fullname de tipo string

type UserData<T extends string | {name: string; fullname: string}>={
    username: T
}

//Pongamos que quiero crear un tipo que reciba un genérico y saque el tipo de su propiedad id

type IdOf<T>= T["id"] // esto da error porque en el genérico me pueden pasar cualquier cosa
                    // us string que no tenga la propiedad id, un numero que no tenga la propiedad id, etc

//Solución

type IdOf<T extends {id: string | number}> = T["id"] //saco del genérico la propiedad id

type MyId = IdOf<{id:string}>
type MyId2 = IdOf<{id:number}>

//Si ahora hago una función con el parámetro MyId2 va a detectar que es un numero y en el autocompletado
//aparecen los métodos de los números

function myFunction(id:MyId2){
    id.toFixed()//salen todos los métodos de los números
}
~~~

## keyof

- Funciona con tipos y con interfaces
~~~js
interface Directions{
    left: number;
    right: number
}

function moveToDirection(direction: any){
    console.log(`moving to ${direction}`)
}

//si al parámetro direction le pongo la interface Directions me va a obligar que le pase
//un objeto con left y right y yo no quiero eso, quiero solo que me obligue a una de las dos

function moveToDirection(direction: keyof Directions){
    console.log(`moving to ${direction}`)
}

//Me habría servido también con type en lugar de interface
~~~

## typeof


~~~js
let name = "Migue" //TypeScript infiere en que es de tipo string

//Si quiero que este tipo sea del mismo que name uso typeof

type UserName = typeof name;

//Un ejemplo más práctico

type GetAxis = ()=> {x: number, y : number}//GetAxis va a ser una función que devuelva una x y number


const getAxis:GetAxis = ()=>{
    return {
        x:1,
        y:1
    }
}

//los utilityTypes son tipos que ya vienen definidos en Typescript
type Axis = ReturnType<GetAxis>; //de esta manera va adetectar que el tipo es un objeto
                                //que devuelve x e y number

//ReturnType obtiene el tipo que retorna esa función

//Si ahora no existiera GetAxis y le pasar a Axis ReturnType<getAxis> me daría error
//Porque espera un tipo y uno una función, pero puedo usar typeof getAxis

//(Si no he declarado el tipo GetAxis)

type Axis = ReturnType<typeof GetAxis>

//Si quiero extraer el tipo de este Array

const fruits = ['orange', 'apple', 'melon']

type Fruits = typeof fruits; //Typescript detecta que es un array de strings

//Si le coloco el as const deberá ser un array que contenga orange, apple y melon

const fruits = ['orange', 'apple', 'melon'] as const;

//Si lo hago con un objeto

const username ={
    name: "Pepe",
    username: "Pepito"
}


type User = typeof username; //de esta manera detecta que el type User contiene un name y username strings

//Lo mismo, si quiero que contenga los tipos literales uso as const al final del objeto

//Puedo usar typeof en una función

function removeUser(user: typeof username)

removeUser({name:"Juan", username:"Juanito"});
~~~

## Indexed Type Access



~~~js
interface Course {
    id: string | number;
    title: string;
    description: string;
    students: number
}

//Si quiero sacar un tipo a través de una de las propiedades de esta interface

type CourseId = Course ["id"] // de esta manera CourseId siempre va a hacer referencia al tipo
                            // del id de la interfaz Course

const users = [
    {
        id: "paso"
        name: "Pepe",
        username: "Pepito"
    },
     {
        id: 4,
        name: "Terelu",
        username: "Chomsky"
    }
]

//El tipo id puede ser string o number
type User = typeof users; //esto lo detecta como un array, pero yo quiero el objeto del usuario en si

type User = typeof users[number] // De esta manera extraigo el tipo de las propiedades de los objetos del array de users

type UserId = typeof users[number]["id"]; //extraigo el tipo del id ( me dice que puede ser string o number)

//Entonces puedo extraer el tipo de las propiedades de un array de objetos  con typeof y [number]
~~~



