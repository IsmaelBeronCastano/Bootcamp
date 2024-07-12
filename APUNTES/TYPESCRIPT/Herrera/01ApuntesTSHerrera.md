# APUNTES TYPESCRIPT HERRERA

## Castear un tipo any

~~~ts
let Avenger:any = 1;

console.log(<string>Avenger.toUpperCase())

//también puedo usar as

console.log((Avenger as string).toLowerCase());
~~~

- Si un array es de tipo any no es necesario añadirle corchetes en el tipado porque acepta lo que venga
---

## Tupla

- Cuando quiero que el primer valor siempre sea un string, el segundo un número (puedo añadir un tercero boolean)
  
~~~ts
const tupla: [string, number, boolean] = ["Tupla", 3, true]

tupla[1] = 3 // tupla[1] tiene que ser un número
~~~
------

## Enum

~~~ts

enum AudioLevel{
    min,   //0
    mid,   //1
    max    //2
}

console.log(AudioLevel.max) // devuelve 2
~~~

- Puedo asignarle valores. Si no le asigno ningún valor será el valor del anterior + 1

~~~ts

enum AudioLevel{
    min = 1,
    med,        //2
    max = 20,   
    super = 19, 
    monster     //20
}
~~~

- Se recomienda usar siempre los valores del enum porque yo puedo asignarle cualquier número

~~~ts
const walkman: AudioLevel = AudioLevel.med;
~~~
-----

## Never

- Si una función devuelve never no debe acabar exitosamente

~~~ts
const funcionNever = (message: string):never{
    throw new Error(message)
}
~~~
---

## Null y undefined

- Para hacer que los valores tipados acepten null o undefined cambiar strictNullCheck a false en el ts-config
- Por defecto undefined es asignable a una variable de tipo null

~~~ts
null !== undefined // true

let vacio:null = undefined; //no da error
~~~
------

## Funciones

- Las funciones son objetos y js pasa los valores por referencia

~~~js
const funcion1=(a:number, b:number)=> a+b

let miFuncion = funcion1 //myFuncion apunta a funcion1, NO ES UNA COPIA

miFuncion(1,2) // devuelve 3

//Yo puedo decir que 
let miFuncion (x:number, y:number)=> number  //y no da error
~~~
-----

## Configurar consola error con archivo .ts

- En el tsconfig, si pongo SourceMap a true me muestra en consola en que linea del archivo .ts está el error
- Para remover los comentarios en el archivo .js de transpilación removeComments: true
- Para excluir archivos ( o incluirlos )

~~~js
{

    {
        //Logica tsconfig
    },
    "exclude":[
        "./path/*.js"
    ],
    "include":[
        "llllll.ts"
    ]

}
~~~
----

# Clases

~~~ts

class Avenger {
    private name: string;
    public realName: string;
    static avgEdad: number;

}

const antman: Avenger = new Avenger()

//solo puedo acceder a antman.realName

//Para acceder a avgEdad solo lo puedo hacer desde la propia clase, no desde la instancia

Avenger.avgEdad = 30;

//si uso un constructor debo introducir las variables en la instancia

class Avenger {
    private name: string;
    public realName?: string;
    static avgEdad: number;

    constructor(name: string, realName?: string){
        this.name = name;
        this.realName = realName;
    }
}

const antman: Avenger = new Avenger('Antman', 'Captain')
~~~

## Forma corta de asiganr propiedades

- Puedo crear y establecer en la misma linea sin usar el this.propiedad
~~~ts

class Avenger{
    static avgAge: number = 35

    constructor(private name: string, public realName?: string, avgAge: number = 55){ // no se puede poner static en el constructor
        Avenger.avgAge = avgAge
    }
}

console.log(Avenger.avgAge) // devuelve 55
~~~
-----

## Métodos públicos y privados

- Si no especifico nada el método por defecto es público
- Si le pongo el modificador de acceso private, no es accesible desde fuera de la clase (solo internamente)
- Con static puedo acceder sin hacer una instancia de la clase, sino directamente desde la clase como tal
~~~js
class Avenger{
    static avgAge: number = 35
    static getAvgName(){
        return this.name  // me devuelve Avenger, el nombre de la clase  (las clases también tienen un nombre)
    }

    constructor(private name: string, public realName?: string, avgAge: number = 55){ // no se puede poner static en el constructor
        Avenger.avgAge = avgAge
    }

    bio(){  //por defecto cuando no se pone nada es público
        return `${this.name} , ${this.realName}`  
    }
}
~~~
----

## Herencia, super y extends

~~~js
class Avenger {
    constructor(
        public name: string,
        public realName:string
    ){
        console.log("Constructor Avenger llamado!")
    }

    protected getFullName(){  //con protected puedo acceder al método desde la propia clase y las subclases
        return `${this.name}, ${this.realName}`
    }
}

class Xmen extends Avenger {

    constructor(
        name: string,           //debo declarar las variables del padre para pasarlas al constructor super
        realName: string,
        public isMutant: boolean){  //si tiene un constructor tengo que llamar al constructor padre con super()
        super(name, realName); //debo pasarle name y realName

        //super debe ser llamado antes que cualquier otra cosa

    }

    getFullNameDesdeXmen(){
        console.log(super.getFullName())
    }
}

const Wolverine = new Xmen('Wolverine', 'Logan', true)

Wolverine.getFullNameDesdeXmen();
~~~
----

## Gets y Sets

- Es lo mismo que en java

~~~ts
class Xmen extends Avenger {

    constructor(
        name: string,           //debo declarar las variables del padre para pasarlas al constructor super
        realName: string,
        public isMutant: boolean){  //si tiene un constructor tengo que llamar al constructor padre con super()
        super(name, realName); //debo pasarle name y realName

        //super debe ser llamado antes que cualquier otra cosa

    }

    get fullName(){     //los getters tienen que devolver un valor
        return `${this.name}- ${this.realName}`
    }

    //Se pueden disparar funciones asíncronas en los getters pero debe devolver un valor síncrono

    set fullName(name: string){  //set solo puede recibir un argumento
       
       if(name.length< 3){
        throw new Error("El nombre es demasiado corto")  //puedo ponerle lógica al setter
       }
       this.name = name
    }


    getFullNameDesdeXmen(){
        console.log(super.getFullName())
    }
}

const Wolverine = new Xmen('Wolverine', 'Logan', true)

console.log(Wolverine.fullName)

//los getters no se ejecutan ( no se invocan con parentesis)
Wolverine.fullName = "Caguetes" // al pasarle un valor con = el setter lod etecta
~~~

## Clases Abstractas

- Las clases abstractas sirven para crear otras clases, no sirven para crear instancias

~~~ts
abstract class Mutante {
    constructor(
        public name: string,
        public realName: string
    ){}

 
}


//NO se puede crear una nueva instancia de una clase abstracta
//ERROR NO PERMITIDO
const wolverine = new Mutant('Wolverine', 'Logan')//ERROR
//ERROR NO PERMITIDO



class Xmen extends Mutante {
    name: string;
    realName: string;
    constructor(public team: string){
        super(name, realName)
    }
}

class Villan extends Mutante{

}

const wolverine = new Xmen('Wolverine', 'Logan', "SuperTeam')
~~~

- Puedo crear otras clases que extiendan de Mutante
- Si uso el tipo Mutante voy a tener disponible .name y .realName 

~~~ts
const magneto = new Villan("Magneto", "Magnus")

function printName = (character: Mutante)=>{
    console.log(character.name)
}

printName(magneto)
~~~

- Si Villan no fuera una extensión de Mutante daría error
~-----

## Constructores Privados

- Se puede usar para controlar cómo las instancias son ejecutadas
- Sirve sobretodo para manejar SingleTones ( una única instancia de la clase)

~~~ts
class Apocalipsis{

    static instance: Apocalipsis;
    private constructor(public name: string){ // si le coloco private al constructor

    }

    static callApocalipsis(): Apocalipsis{ // me va a devolver algo de tipo Apocalipsis
        if(!Apocalipsis.instance){
            Apocalipsis.instance = new Apocalipsis("Soy Apocalipsis")
        }  // si no existe la instancia la creo
    }
}

const apocalipsis = Apocalipsis.callApocalipsis() 
const apocalipsis2 = Apocalipsis.callApocalipsis() //es la misma instancia que apocalipsis

// NO puedo crear instancias con new Apocalipsis()
~~~
----


