# 03 Typescript

## Conditional Types

~~~js
interface Animal {
    move(): void;

}

interface Dog extends Animal{
    bark(): void;
}

//Quiero comprobar si Dog extiende o no de Animal y que mi tipo sea distinto en función a eso
//uso un ternario

type Example = Dog extends Animal ? string : number;

//Esto es útil cuando se usan genéricos

function getUserId<T>(): T extends string ? {id: string, case: string}: number{

}


const userId = getUserId<string>() // devuelve un objeto con id y case de tipo string
//cualquier cosa que no sea un string va a devolver de tipo number
~~~

## Creando un tipo Flatten

~~~js

//Quiero que esto , cuando lo utilice infiera en el tipo, si le paso un array de string que saque el tipo string

type Flatten<T> = T extends Array<infer Item> ? Item : T //infiere sobre los items del array ( es un ternario )

type FlattenArray= Flatten<string[]> //me saca el tipo string del array

type FlattenArray2= Flatten<[string, number]> // El array puede ser de string o number

//Si le paso algo que no es un array me devuelve el tipo original

type FlattenNumber = Flatten<number> // devuelve el tipo number

//si me pasan un array devuelve el tipo del array
~~~

## Infer en Conditional Types

- Quiero tener un tipo que pasándole el tipo de una función extraiga lo que devuelve esa función

~~~js
//Quiero crear un type con las misma funcionalidad como el ReturnType predefinido en Typescript
//lo voy a limitar para que solo se pueda usar con una función
//puede recibir cualquier número de argumentos
//cualquier función va aser válida para pasar como genérico aqui
//comparo el genérico con una función y le digo que infiera el return
// si no devuelve el Return devuelve de tipo never porque nunca debería de llegar ahi
//lo que me pase tiene que ser una función

type GetReturnType<T extends (...args: any[])=> any> = T extends (...args:any[]) => infer Return ? Return : never  
~~~

- Entonces:
  - El tipo es el de una función de cualquier tipo con cualquier numero de argumentos de cualquier tipo
  - Le digo que en esta función con cualquier argumento que tenga, infiera en el valor de return 
  - Me devuelve never si no se cumple porque siempre se va a cumplir porque siempre debo pasarle una función

~~~js
 function getDate(){
    return new Date()
 }

//Recibe un genérico que es el tipo de una función, por ello uso typeof para traer el tipo
 type NewDate = GetReturnType<typeof getDate> // devuelve un tipo Date
~~~

## Distributive Conditional Types

~~~js
type ToArray<T>= T extends any ? T[]: never // que devuelva un array del tipo que sea el genérico


type StringToArray = ToArray<string> // devuelve un array de strings

//Si le paso varios tipos va a inferir en los varios tipos
type StringOrNumberToArray = ToArray<string | number> //devuelve un array de string o un array de numbers
~~~
- En una condición si se le pasa una unión de tipos lo que devuelva la condición se va a aplicar en cada uno de ellos

## Desactivar Distributive Conditional Types

~~~js
type StringOrNumberToArray = ToArray<string | number> // No puedo mezclar tipos en el mismo array

//Puedo desactivar el comportamiento por defecto metiendo el genérico y el tipo entre llaves

type ToArray<T>= [T] extends [any] ? T[]: never 

type StringAndNumberToArray = ToArray<string | number> //Ahora no es un array de strings o un array de numbers.
 //Es un array que puede contener strings y numbers en el mismo array

const myArray: StringAndNumberToArray = ["strings", 123, "hi"]
~~~

- Meto entre llaves el genérico y el tipo y se desactiva el comportamiento por defecto el distributive conditional types


## Mapped Types

~~~js

//puede ser un tipo y una interfaz

type User={
  username: string;
  age?: number;
  readonly birthday:string; //readonly porque no va acambiar
}

//Ahora quiero tener un tipo que va a recibir como genérico un objeto y quiero que devuelva sus propiedades convertdias a boolean
//MakeBoolean<User>=>{username:boolean, age?:boolean, birthday:boolean}

//Para eso tenemos que iterar, y para eso sirve Mapped Types

type MakeBoolean<T> ={
  [key in keyof T]:boolean //por cada propiedad del objeto voy a devolver un boolean
}

type UserBoolean = MakeBoolean<User> //Ahora username es de tipo boolean, age es boolean o undefined y birthdate es boolean
~~~
- Hay tipos predefinidos en Typescript que hacen estos mapeos, como Partial o Required

## Tipos con dos genéricos

~~~js
//Quiero un tipo con dos genéricos, un genérico y un key
//MyPickUser<T, K> La T va a ser el tipo, y la K la propiedad de T con la que me quiero quedar
//MyPick<User, "username">=> {username: string} // solo se quedaría con esa key que le he pasado como genérico

type MyPick<T,K extends keyof T>={
  [property in K]: T[property] // del genérico quedate con la property. Puedes poner property P o lo que quieras
  //property va a equivaler a cada una de las propiedades que me pasen en K
  //de mi tipo solo me voy a quedar con esa propiedad
}

type OnlyUsername = MyPick<User, "username"> // ahora es un tipo que solo tiene username
~~~

# Utility Types

- Los utility types son tipos que ya vienen definidos en Typescript
- Nos proporcionan utilidad para distintos escenarios
- 
## Awaited

- Es un tipo que recibe como genérico un tipo de promesa (por ejemplo que devuelve un string)
- Lo que va a hacer Awaited es extraer lo que resuelve esa promesa, en este caso un string

~~~js
type TaskResult = Promise<string> // de tipo una promesa que resuleve en un string. Le puedo pasar any

type TaskPromiseResult = Awaited<TaskResult> //resuelve en un string 
~~~

## Partial

~~~js
interface Todo {
  name: string;
  title: string;
  date: string;
}

//Quiero actualizar uno de los campos de Todo
function updateTodoFields(todo: Todo, fields: Partial<Todo>){{  //Partial recibe un genérico, ene ste caso Todo
    fields.toLowerCase()
}

const myUser={
  name: "Pere",
  title:"casum",
  date:"12-09-2003"
}

updateTodoFields(myUser, "name") // pone el nombre todo en minúsculas
~~~
- Partial convierte las propiedades en opcionales

## Required

- Convierte las propiedades en obligatorias

~~~js
interface Student {
  name: string;
  username?: string
}


//Quiero hacer algo que actualice name y username (las dos obligadas) pero le he dicho en la interface que username es opcional 
function updateStudentInfo(student: Required<Student>)


updateStudentInfo({
  name: "Pere",
  username: "Pit" //si no le paso las dos me marca error
})

//el codigo del tipo Required (predefinido en Typescript) es como los mapped que vimos antes

type Required<T>={
  [P in keyof K]-?: T[P] //con el menos esta quitando el modificador del opcional y devuelve todas las propiedades
}

//en el del Partial no está el menos, le añade el modificador del opcional ?

type Partial<T>={
  [P in keyof T]?: T[P]
}

~~~
- En lugar de crear una nueva interfaz RequiredStudent puedo usar la misma

## ReadOnly

~~~js
interface Pet {
  name: string;
  size: number
}

type ReadonlyPet = Readonly<Pet> // le añado readonly a todas las porpiedades de Pet

//El tipo predefinido Readonly le está añadiendo un modificador a todas sus propiedades iterando

type Readonly = {
 readonly [ P in keyof T]: T[P]
}
~~~

## Record

- Sirve para designar un objeto

~~~js
interface PositionInfo{
  amount: number;
  delay: number
}

type Position = "Left" | "Right"

//Quiero determinar un objeto cuyas keys se determinen en base a Position, que sea left y right
//Los valores van a ser determinados por PositionInfo

//{left:{amount: 1, delay:2}, right:{ amount:3, delay:2}}


type PositionComplete = Record<Position, PositionInfo> // Le paso primero lo que va a determinar las keys, y segundo los valores

const positions: PositionComplete = {
  left:{
    amount:1,
    delay:2
  },
  right:{
    amount:3,
    delay:2
  }
}
~~~

- Ahora el tipo PositionComplete obliga a tener las keys Left y Right, cada una con los valores amount y delay


## Pick

- Pick nos sirve para pasarle como primer genérico un tipo o una interfaz que sea un objeto, y como segundo genérico con que propiedades me quiero quedar y se va a quedar solo con esa

~~~js
interface User {
  id: number;
  email: string;
  username: string
}

function registerUser(user:User){
  //lógica
}

//en el user que le paso a registerUser todavía no tengo el id
//podrías pensar en crear otra interfaz y quitarle el id, pero hay otra manera


function registerUser(user: Pick<User, "email" | "username">){ // me quiero quedar solo con email y username
  //lógica
}

//En el código de Typescript el tipo Pick se describe asi

type Pick<T, K extends keyof T>={
  [P in K]: T;
}
~~~

## Omit

- En el caso anterior sería más útil quitar el id y ya está
- Para eso sirve Omit

~~~js
function registerUser(user: Omit<User, "id">){}
~~~

## Exclude

- Exclude sirve para dada una unión de tipos eliminar los que yo quiera

~~~js
type UserId = string | number;

function uppercaseId( id: Exclude<UserId, number> ){ // me quedo solo con el tipo string

} 

//Si quiero excluir varios los separo con pipe |
~~~

## NonNullable

- Sirve para dada una unión de tipos quitar los que sean null o undefined

~~~js
type PlayerPhone = string | undefined

//si yo se que esta función solo la voy a llamar cuando este phone de tipo PlayerPhone exista puedo usar el NonNullable
function updatePhone(phone: NonNullable<PlayerPhone>){ //ahora apunta a un string si o si
  phone.toUpperCase()
}
~~~

## Parameters

- Extrae como una tupla los parámetros de las funciones

~~~js

function feedDog(dogId: number, food: string){

}

//Quiero crear un tipo que extraiga los parámetros que le he dado a la función feedDog

type FeedDogParams = Parameters<typeof feedDog>

// si ahora quiero crear una constante de tipo FeedDogParams tiene que ser una tupla con un número y un string

const params: FeedDogParams = [1, "pienso"]
~~~

## Manipulación de strings

~~~js
const teachername = "Migue"

const teacherUpper:Uppercase<typeof teacherName> = "MIGUE" //Debo poner migue en mayúscula para que no de error, pq es un literal 
                                                            //al llevar const
                                                            //si hubiera usado let tendría que ser cualquier string en mayúscula

//Lowercase para obligarme a ponerlo en minúscula

//También está Capitalize para poner la primera mayúscula

//Uncapitalize solo me va a dejar ponerlo si la primera no es mayúscula
~~~

## Exports

~~~js

type CourseId = string | number;

export interface Course { //le añado directamente export para exportar
  name: string;
  title: string;
  students: number;
  id: CourseId
}
~~~


# BONUS- REACT CON TYPESCRIPT

## Props

~~~js

interface Props {
  value: number
}

export const Counter: React.FunctionComponent<Props> = ({value})=>{ // esto me obliga a pasarle un value de tipo number
  return ( 
    <>

      <h1> Hi! I'm a counter </h1>

    </>
  )
}


//sería lo mismo hacerlo así

export function SuperCounter({value}:Props){
  return(
    <div>
      <h1>I'm a counter! </h1> 
    </div>
  )
}

<Counter value = 0> // estoy obligado a pasarle un value

~~~

## Children

~~~js
export const ParentComponent = ()=>{
  return(
    <p> hi!</p>
  )
}

//Yo no puedo ponerle children al componente si no lo especifico antes
<ParentComponent>
  <SuperCounter /> 
</ParentComponent>
//estas lineas de arriba darían error

interface ParentComponentProps{
  children: ReactNode;
}

export const ParentComponent: React.FunctionComponent<ParentComponentProps> = ()=>{
  return(
    <p> hi!</p>
  )
}

//si ahora pongo el componente ParentComponent sin children me marca error
//Puedo usar el condicional ? en la interfaz para hacerlo opcional

interface ParentComponentProps{
  children?: ReactNode;
}
~~~

## useState

~~~js
//puedo usar un genérico en el useState

const [state, setState]= useState<T>() 

//si le pongo number, Counter va aser de tipo number

const [state, setState]= useState<number>()
~~~

## useRef

~~~js
const ref = useRef<string>() // solo me va a dejar pasarle strings

//muchas veces se declara null para usarlo cuando se lo ibamos a pasar a un elemento

const ref = useRef(null)

//para solucionarlo le paso el elemento HTMLHeadElement al ser un h1
//Si fuera un div sería HTMLDivElement

const ref = useRef<HTMLHeadingElement>(null)