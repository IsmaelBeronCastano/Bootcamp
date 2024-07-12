# 01 Aplicacion Consola NODEJS HERRERA

- Instalo colors 
- Creo app.js
- NOTA: por defecto Node no emplea async await ya que corre todo secuencialmente
- Para poder usar async await creo la función main()

~~~js
import colors from 'colors'


console.clear(); //para limpiar todo lo que haya en consola

const main =async()=>{

}

main();
~~~
------

## stdin-stdout-Readline

- Primero crearé el menú, luego será más interactivo ( y eficiente )
- Creo la carpeta /helpers/mensajes.js
- El .green es del paquete colors, para añadirle color. \n es un salto de linea
- mensajes.js

~~~js
import colors from 'colors'

//esto va a terminar siendo una promesa
export const mostrarMenu = ()=>{
    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)
}
~~~

- La importo en app.js y la invoco dentro del main( )
- Sigo con el menú. Pongo el numero como un string en un template literal para poder aplicarle color

~~~js
import colors from 'colors'

//esto va a terminar siendo una promesa
export const mostrarMenu = ()=>{
    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)

    console.log(`${'1.'.green} Crear una tarea`)
    console.log(`${'2.'.green} Listar tareas`)
    console.log(`${'3.'.green} Listar tareas completadas`)
    console.log(`${'4.'.green} Listar tareas pendientes`)
    console.log(`${'5.'.green} Completar tarea(s)`)
    console.log(`${'6.'.green} Borrar tarea`)
    console.log(`${'0.'.green} Salir\n`)
}
~~~

- Cómo recibir info del usuario
- Debo preparar la interfaz. Importo el paquete readline que ya existe en Node. Le indico el input y el output con createInterface
- El .question se usa cuando se necesita el stdout (mostrar la información al usuario con la pregunta)

~~~js
import colors from 'colors'
import readline from 'readline'

//esto va a terminar siendo una promesa
export const mostrarMenu = ()=>{
    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)

    console.log(`${'1.'.green} Crear una tarea`)
    console.log(`${'2.'.green} Listar tareas`)
    console.log(`${'3.'.green} Listar tareas completadas`)
    console.log(`${'4.'.green} Listar tareas pendientes`)
    console.log(`${'5.'.green} Completar tarea(s)`)
    console.log(`${'6.'.green} Borrar tarea`)
    console.log(`${'0.'.green} Salir\n`)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    //ejecuta un callback ( cuando la función termine )
    rl.question('Seleccione una opción ', (opt)=>{
        console.log({opt}) //me muestra la opción introducida en la consola

        rl.close() // hay que cerrar el readLine porque si no se va a quedar esperando
    })
}
~~~

- Para pausar la aplicación creo una función 
- mensaje.js

~~~js
import colors from 'colors'
import readline from 'readline'

//esto va a terminar siendo una promesa
export const mostrarMenu = ()=>{
    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)

    console.log(`${'1.'.green} Crear una tarea`)
    console.log(`${'2.'.green} Listar tareas`)
    console.log(`${'3.'.green} Listar tareas completadas`)
    console.log(`${'4.'.green} Listar tareas pendientes`)
    console.log(`${'5.'.green} Completar tarea(s)`)
    console.log(`${'6.'.green} Borrar tarea`)
    console.log(`${'0.'.green} Salir\n`)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    //ejecuta un callback ( cuando la función termine )
    rl.question('Seleccione una opción ', (opt)=>{
        
        rl.close()
    })    
}

    //creo una función de pause
   export const pause = ()=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
                    //presionando cualquier cosa continuará
        rl.question(`\nPresion ${'ENTER'.green} para continuar\n`, ()=>{
            rl.close()
        })
    }
~~~

- La invoco en el main después de mostrarMenu
- De esta manera se comió el primer readline de seleccione una opción, porque hay dos instancias del readline y dos callbacks, al ser secuencial, está tomando solo el último. Por eso aparece directamente presione ENTER sin darme la opción a seleccionar
- Para solucionar esto, primero voy a tener que esperar a que la persona ingrese algo
- Voy a tener que repetir este ciclo de ingresar la opción hasta que esta sea 0 y salga
----

## Repetir el menú de forma infinita

- Usaré un do while en el main
- Tengo que esperar a recibir una respuesta de mostrarMenu para que el dowhile no sea un bucle infinito
- No puedo convertir mostrarMenu con async porque tendría que entrar en la funcion rl.question y resolverla con un return, pero eso no resolvería la promesa de mostrarMenu
- Creo un return de una nueva promesa. 
  - Uso solo el resolve, el reject no lo voy a usar. Si tengo un error lo manejaré en su momento 
  - Coloco dentro de la promesa el código
  - Le paso el resultado de la console ( el opt) al resolve
- Hago lo mismo con la función pause

~~~js
import colors from 'colors'
import readline from 'readline'

//esto va a terminar siendo una promesa
export const mostrarMenu = ()=>{


    return new Promise((resolve)=>{
        
            console.clear()
            console.log("================================".green)
            console.log("     Seleccione una opción   ".green)
            console.log("================================\n".green)
        
            console.log(`${'1.'.green} Crear una tarea`)
            console.log(`${'2.'.green} Listar tareas`)
            console.log(`${'3.'.green} Listar tareas completadas`)
            console.log(`${'4.'.green} Listar tareas pendientes`)
            console.log(`${'5.'.green} Completar tarea(s)`)
            console.log(`${'6.'.green} Borrar tarea`)
            console.log(`${'0.'.green} Salir\n`)
        
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
        
            //ejecuta un callback ( cuando la función termine )
            rl.question('Seleccione una opción ', (opt)=>{
                rl.close()
                resolve(opt) //aquí puedo mandarle el resolve de la promesa
            })    

    })
}

//creo una función de pause
   export const pause = ()=>{

    return new Promise(resolve=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question(`\nPresion ${'ENTER'.green} para continuar\n`, ()=>{
            rl.close()
            resolve() //no me interesa devolver nada, porque no necesito nada de lo que la persona escriba
                    //Cuando tengamos el readline, ahí es donde se va a ejecutar esto
        })

    })
    
    }
~~~

- Ahora puedo hacer el await de mostrarMenu porque reseulve una promesa
- Guardo el resultado de la promesa en opt
- app.js

~~~js
import colors from 'colors'
import { mostrarMenu, pause } from './helpers/mensajes.js';

console.clear();

const main =async()=>{

    let opt = ""
  do {
    
    opt = await mostrarMenu();
    
    if(opt !=='0') await pause()

  } while (opt !== '0') //pongo 0 como string porque lo que devuelve la consola es un string
    
}

main();
~~~

- Evidentemente hay que validar que sean números, pero ya soy capaz de recibir la información que ingresa el usuario
- Me gustaría que con las teclas direccionales puediera seleccionar una de las opciones
  - Para ello tendría que saber en que índice me encuentro, colorear esa linea y las demás no
  - Si toco direccional arriba, tendría que releer el input, y moverme desde dónde me encuentre, si estoy en el 1 ir abajo al 0, etc
- **Hay muchos paquetes en Node**. Cuando tengas un problema, seguro hay un paquete en Node para ello
------

## Construir el menú interactivo - Inquirer

- Instalo inquirer con npm
- Trabaja en base a promesas
- Primero con inquirer.prompt se introduce el cuerpo, resuelve en un then con la respuesta y atrapo el error con un catch
- Con inquirer haty validaciones, tipos de datos, etc
- Creo un archivo en helpers llamado inquirer.js
- inquirer.js

~~~js
import inquirer from 'inquirer'
import colors from 'colors'

//Creo la constante preguntas (el arreglo de questions que me pide el inquirer) fuera del inquirerMenu
const preguntas= [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: ['1. Crear Lista', 'opt2', 'opt3']
    }
]; 


export const inquirerMenu = async()=>{

    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)

    //como inquirer trabaja en base a promesas puedo usar el await
    //guardo el resultado de la promesa en opt y lo retorno como resultado
    const opt= await inquirer.prompt(preguntas)

    return opt
}
~~~

- app.js

~~~js
import colors from 'colors'
import { inquirerMenu } from './helpers/inquirer.js';

console.clear();

const main =async()=>{

    let opt = ""
  do {
    
    opt = await inquirerMenu();
    
    

  } while (opt !== '0') 
    
}

main();
~~~

- Ahora si marco la opción 1 si hago un console.log de opt me devuelve el string '1. Crear Lista'
- Yo puedo querer que me devuelva un valor
----

## Opciones del menú interactivo

- Puedo desestructurar la opción del resultado de la promesa
~~~js
import inquirer from 'inquirer'
import colors from 'colors'

//Creo la constante preguntas (el arreglo de questions que me pide el inquirer) fuera del inquirerMenu
const preguntas= [
    {
        type: 'list',
        name: 'opcion', //desestructuro opcion porque es lo que pongo en el name
        message: 'Que desea hacer?',
        choices: [
            {
                value: '1', //es importante pasar el número como string porque así se lee de consola
                name: '1. Crear tarea'
            },
            {
                value: '2',
                name: '2. Listar tareas'
            },
            {
                value: '3',
                name: '3. Listar tareas completadas '
            },
            {
                value: '4',
                name: '4. Listar tareas pendientes'
            },
            {
                value: '5',
                name: '5. Completar tarea(s)'
            },
            {
                value: '6',
                name: '6. Borrar tarea(s)'
            },
            {
                value: '0',
                name: '0. Salir'
            },
        ]
    }
]; 


export const inquirerMenu = async()=>{

    console.clear()
    console.log("================================".green)
    console.log("     Seleccione una opción   ".green)
    console.log("================================\n".green)

    //puedo desestructurar la opcion del resultado de la promesa
    const {opcion}= await inquirer.prompt(preguntas)

    return opcion
}
~~~

- Falta ponerle pausa
- Será de tipo input, no necesita opciones
- inquirer.js
- 
~~~js
export const pausaAction = async()=>{

    const question =[ 
        {
            type: 'input',
            name: 'pausa',
            message: `Pulsa ${'ENTER'.green} para continuar`
        }
    ]
    
    console.log('\n') //le añado un salto de linea para que no estñe tan pegado

    await inquirer.prompt(question)

}
~~~
----

## Lógica para el manejo de las tareas por hacer

- Creo la carpeta models/tarea.js
- Creo la clase Tarea
- Uso el paquete uuid para el id

~~~js
import {v4} from 'uuid'


export class Tarea{
    
    //inicializar así las variables no es necesario, pero hecho así se asemeja a otros lenguajes
    
    id=''
    desc=''
    completadoEn = null //si es null significa no completado pero si tiene algo es que está completado. Se puede manejar así

    //lo único que voy a pedir es la descripción de la tarea
    constructor(desc){
        this.desc = desc;
        this.id = v4()
        this.completadoEn = null //esto es redundante pero así queda más claro
    }
    
}
~~~

- Como ocupo manejar varias tareas creo otro archivo en models llamado tareas, con s
- tareas.js

~~~js
export class Tareas{
    
    //no quiero manejar listado como un arreglo, pero significaría que a cada rato voy a tener que estar buscando el índice
    //barriendo todo para saber en que posición está algún elemento. Entonces lo quiero manejar como un objeto
    _listado = {} // en realidad no hace falta definirlo aqui, se define en el constructor, pero lo hace más fácild e observar
    //lo que busco es manejarlo como un objeto {'uuid-2323-3434-4-687-8-6-5': Tarea{id:'12121212', desc: 'ndlwhdowidj', completadoEn: null}, otrouuid }
    constructor(){
        this._listado = {}
    }

    //aqui van los métodos para insertar, completar, etc                                            
}
~~~
- Compruebo que todo funcione
- Le añado la descripción en duro por el momento
- app.js

~~~js
import colors from 'colors'
import { inquirerMenu, pausaAction } from './helpers/inquirer.js';
import { Tarea } from './models/tarea.js';

console.clear();

const main =async()=>{

    let opt = ""
  do {
    

    //opt = await inquirerMenu();
    
    const tarea = new Tarea('Comprar comida'); //le añado la descripción en duro
    console.log(tarea)
    
    await pausaAction()

  } while (opt !== '0') 
    
}

main();
~~~

- Voy a tener algo así en el do del main

~~~js
const tareas= new Tareas()

const tarea = new Tarea('Tarea a realizar')

tareas._listado[tarea.id] = tarea; // computo el id y le paso la tarea

console.log(tareas)
~~~

- devuelve esto en consola
~~~js
Tareas {
  _listado: {
    '37af4f4c-d297-4d22-82f6-54c55839f940': Tarea {
      id: '37af4f4c-d297-4d22-82f6-54c55839f940',
      desc: 'Tarea a realizar',
      completadoEn: null
    }
  }
}
~~~

- Tareas es quien se va a encargar de insertar, completar, etc
--------

## Crear y Listar tareas

- Quiero que seleccionando la opción 1 pueda crear una tarea y la 2 listarlas todas
- Creo una nueva instancia de Tareas

~~~js
import colors from 'colors'
import { inquirerMenu, pausaAction } from './helpers/inquirer.js';
import { Tarea } from './models/tarea.js';
import { Tareas } from './models/tareas.js';

console.clear();

const main =async()=>{

    let opt = ""
    const tareas = new tareas

  do {
    
     opt = await inquirerMenu();
    
    
    await pausaAction()

  } while (opt !== '0') 
    
}

main();
~~~

- tareas.js

~~~js
import { Tarea } from "./tarea.js"

export class Tareas{
    
    _listado = {} 
                                              
    constructor(){
        this._listado = {}
    }

   crearTarea(desc=""){

    const tarea = new Tarea(desc)
    
    //_listado es un objeto, no un arreglo. Computo el uid como propiedad y le paso la tarea

    this._listado[tarea.id] = tarea

   }
                                            
}
~~~

- Para manejar las opciones usaré un switch en el do del dowhile del main
- Para que el usuario introduzca datos en el casod e crear una tarea hay que usar el inquire nuevamente
  - Como voy a tener que reutilizar esta función la creo aparte en helpers/inquirer
- inquirer.js

~~~js
export const leerInput = async (message) =>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message: message,
            validate(value){       //validate es una función que tiene el value que se acaba de escribir
                if(value.length === 0){   //hago la validación  de que el value no esté vacio
                    return 'Por favor, ingrese un valor'  
                }
                return true
            }

        }
    ]

    const {desc} = await inquirer.prompt(question)
    return desc
}
~~~

- dentro del main de app.js

~~~js
do {
    
     opt = await inquirerMenu();

     switch(opt){
      case '1':
        const desc = await leerInput('Descripción: ') //Aparece Descripción: para que después introduzca mi tarea
        console.log(desc) //me devuelve lo que he escrito en la descripción

        tareas.crearTarea(desc) //creo la tarea, la guarda en Tareas
      break;
      case '2':
        console.log( tareas._listado) // aunque en principio _listado es privada lo pongo así de momento (fast way)
      break;
     }
    
    
    await pausaAction()

  } while (opt !== '0') 
~~~

- Si detengo la aplicación pierdo las tareas porque las tengo en memoria
----

## Transformar un objeto a un arreglo, detalles estéticos

- Creo un getter en Tareas
- Me interesa trabajar en base al id
- tareas.js

~~~js
    //getter
    get listadoArr (){
       const listado = []
       
       //Object.keys me devuelve las llaves ( la palabra de la izquierda )
       //Todo esto es síncrono, no hace falta el await

       Object.keys(this._listado).forEach(key=>{
        const tarea = this._listado[key]
        
        listado.push(tarea)
       })

       //se podría hacer así : const listado= [...Object.values(this._listado)]

       return listado
    }
~~~

- Lo llamo desde el main.js
- main.js

~~~js

const main =async()=>{

    let opt = ""
    const tareas = new Tareas

  do {
    
     opt = await inquirerMenu();

     switch(opt){
      case '1':
        const desc = await leerInput('Descripción: ')
        tareas.crearTarea(desc)

      break;
      case '2':
        console.log( tareas.listadoArr ) //llamo al getter
      break;
     }
    
    
    await pausaAction()

  } while (opt !== '0') 
    
}
main()
~~~

- En lugar de hacerlo así se puede hacer con una sola linea
- tareas.js

~~~js
const listado= [...Object.values(this._listado)]
return listado
~~~

## Guardar tareas en un archivo de texto

- Para hacer persistente la info, en lugar de usar una DB se usará un archivo de texto
- Creo en /helpers/guardarArchivo.js
- Como se que la función guardarDB va a estar en app.js, le indico la ruta a la carpeta db ( que he creado ) con el nombre del archivo
- guardarArchivo.js

~~~js
import fs from 'fs'

export const guardarDB = ( data )=>{
    
    //tiene que existir la carpeta para que funcione
    const archivo = './db/data.txt'
    
    fs.writeFileSync(archivo, data)
}
~~~

- Dónde coloco la función?
- Puedo colocarlo **después del switch** ( en el main ) para que siempre grabe, pese a que hay opciones que no lo necesita
    - Podría colocarlo en casos específicos del switch
~~~js
 guardarDB(tareas.listadoArr) //lo guardo como un arreglo
~~~

- Así **DA ERROR** porque hay que parsear a string el resultado. Salta este error

> TypeError ERR_INVALID_ARG_TYPE: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined

- Lo parseo con JSON.stringify

~~~js
export const guardarDB = ( data )=>{
    
    //tiene que existir la carpeta para que funcione
    //creo un json que se ve mucho mejor
    const archivo = './db/data.json'
    
    fs.writeFileSync(archivo, JSON.stringify(data))
}
~~~

- Ya lo tengo en el archivo json en la carpeta db!
- Todavía no es persistente, ya que si cierro y vuelvo a subir el server, la instancia de Tareas se va a crear de nuevo, etc
------

## Leer de la DB

- Creo la función leerDB en helpers/guardarArchivo.js 
- archivo lo defino fuera de la función para así tener alcance desde la otra función

~~~js
import fs from 'fs'

const archivo = './db/data.json'

export const guardarDB = ( data )=>{
    
    //tiene que existir la carpeta para que funcione
    
    fs.writeFileSync(archivo, JSON.stringify(data))
}

export const leerDB =()=>{
    if(!fs.existsSync(archivo)){
        return null  // si no existe regreso null
    }

    const info = fs.readFileSync(archivo,{encoding: 'utf-8'})//esto daría error si el archivo no existiera por eso la verificación con el if de antes
        //tengo que pasarle el encoding para que no me regrese los bytes

    //como me devuelve un string, tengo que parsear la data
    const data = JSON.parse(info)
    
    return data

}
~~~
- La data que ya había en el json no son instancias de Tarea
- En data tengo un arreglo de tareas
- En base al arreglo tengo que volver a construir como esta funcionando la aplicación, el objeto de _listado con la llave Uuid apuntando a la tarea
- main.js

~~~js
const main =async()=>{

    let opt = ""
    const tareas = new Tareas
    
    const tareasDB = leerDB()

    if(tareasDB){

    }
~~~
------

## Cargar Tareas

- Creo en tareas.js dentro de la clase Tareas el método cargarTareasFromArray
- Lo llamo en el main

~~~js
const main =async()=>{

    let opt = ""
    const tareas = new Tareas

    const tareasDB = leerDB()

    if(tareasDB){  //cargar tareas
      tareas.cargarTareasFromArray(tareasDB)
    }
~~~

- El método de tareas.js

~~~js
    cargarTareasFromArray(data=[]){
        data.forEach(tarea=>{
            this._listado[tarea.id] = tarea;
        })
    }
~~~

- En este punto la app da *ERROR* si no hay un objeto en el JSON
------

## Listar tareas

- Creo un nuevo método en tareas.js llamado listadoCompleto
- uso el getter para obtener el array y trabajar con él
- método de tareas.js

~~~js
listadoCompleto(){
        //el segundo argumento del forEach es el índice
        this.listadoArr.forEach((tarea, indice)=>{
            //const idx = indice +1 //para que empiece por 1 y no por cero. Uso un template string para colorearlo en verde

            const idx = `${indice+1}`.green
            const {desc, completadoEn} = tarea //uso desestructuración para extraer desc y completadoEn, 
            //que me sirve para decir si está completado o no
            
            const estado = completadoEn !== null? 'Completado'.green : 'Pendiente'.red
            console.log(`${idx}- ${desc} :: ${estado}`)

        })
     }
~~~

- Evidentemente coloco tareas.listadoCompleto() en el caso 2 del switch que es listar tareas

~~~js
import colors from 'colors'
import { inquirerMenu, leerInput, pausaAction } from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

console.clear();

const main =async()=>{

    let opt = ""
    const tareas = new Tareas

    //guardo lo que leo en la DB
    const tareasDB = leerDB()

    if(tareasDB){  // si hay tareas lo formateo con cargarTareas al objeto ._listado
      tareas.cargarTareasFromArray(tareasDB)
    }

  do {
    
     opt = await inquirerMenu();

     switch(opt){
      case '1':
        const desc = await leerInput('Descripción: ')
        tareas.crearTarea(desc)
        guardarDB(tareas.listadoArr) //lo guardo como un arreglo

      break;
      case '2':
        tareas.listadoCompleto()
      break;
     }

    
    
    await pausaAction()

  } while (opt !== '0') 
    
}

main();
~~~
----

## Tareas completadas y pendientes

- Creo el método listarPendientesCompletadas(completadas= true)
- Si le paso true me muestra las completadas, si le paso false me muestra las pendientes
- Creo una variable indice fuera del forEach
- La paso a string para poder colorearla. Si sumo un numero + un string resulta un string. Le sumo el punto
- Si la tarea no esta completada es el mismo código pero negando con un !

~~~js
//metodo en Tareas (tareas,js)

     listarPendientesCompletadas(completadas = true){
        let indice = 0;
        this.listadoArr.forEach((tarea)=>{

            const {desc, completadoEn} = tarea 
            const estado = completadoEn !== null ? "Completada".green : "Pendiente".red  

            if(completadas){
                if(completadoEn){
                    indice +=1
                    //console.log(`${indice.toString().green}- ${desc} :: ${estado}`)        
                    console.log(`${(indice+ '.').green}- ${desc} :: ${completadoEn.green}`)        
                }
                
            }else{
            
                    if(!completadoEn){
                        indice +=1
                        console.log(`${(indice+ '.').green}- ${desc} :: ${estado}`)        
                    }
                
            }
         }) 
    }                                           
}
~~~

- Evidentemente llamo al método en el case 3 y 4 del switch, en el 4 le paso false a la función tareas.listarPendientesCompletadas(false)
------

## Listado para borrar

- Creo el método borrarTarea de la clase Tarea en tareas.js

~~~js
    borrarTarea(id=""){
        //quiero mostrarle a la persona salirse del menú de eliminación sin borrar nada
        if(this._listado[id]){
            delete this._listado[id]
        }
    }
~~~

- La lógica está en el archivo inquirer.js dónde tengo que crear unas preguntas para hacer el listado del prompt
- creo el caso en el switch

~~~js
  case '6':
    const id = await listadoTareasBorrar(tareas.listadoArr) 
    //importante el await para esperar el resultado y que no reconstruya el menú y de error
    tareas.borrarTarea(id)
  break;
~~~

- inquirer.js

~~~js
export const listadoTareasBorrar =async (tareas) =>{

    const choices = tareas.map((tarea, indice)=>{
        
        const idx = `${indice + 1 }`.green 
        
        //map lo que tiene es que todos los hijos van a tener lo que yo ponga en el return
        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`
        }
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id', // esto es lo que voy a recibir
            message: 'Borrar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas) //puedo desestructurar el id  de la opción seleccionada

    return id
}
~~~

- De esta manera borro directamente pero quiero preguntar la confirmación
-----

## Confirmar y borrar tarea

- Creo una nueva función en el inquirer.js para confirmar

~~~js
export const confirmar = async (message)=>{
    const pregunta =[
        {
            type: 'confirm', //regresa un valor boolean
            name: 'ok',
            message: message
        }
    ]

    const {ok} = await inquirer.prompt(pregunta)
    return ok

}
~~~

- en app.js

~~~js
      case '6':

        const id = await listadoTareasBorrar(tareas.listadoArr) //importante el await para que espere al resultado!
        const ok = await confirmar("Está seguro?")
        if(ok){
          tareas.borrarTarea(id)
          console.log('Tarea borrada')
        }
        break;
~~~

- Puedo añadir la opción 0 para cancelar el menú de borrar con choices.unshift

~~~js
export const listadoTareasBorrar =async (tareas) =>{

    const choices = tareas.map((tarea, indice)=>{
        
        const idx = `${indice + 1 }`.green 
        
        //map lo que tiene es que todos los hijos van a tener lo que yo ponga en el return
        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`
        }
    })

    //unshift añade al principio del array
    choices.unshift({
        value: '0',
        name: '0'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Borrar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas)

    return id
}
~~~

- app.js

~~~js

      case '6':

        const id = await listadoTareasBorrar(tareas.listadoArr) //importante el await para que espere al resultado!
        if(id !== '0'){
          
          const ok = await confirmar("Está seguro?")
          
          if(ok){
            tareas.borrarTarea(id)
            console.log('Tarea borrada')
          }
        }
        break;
~~~
------

## Completar tareas - Multiples selecciones

- El código es muy parecido a listadoTareasBorrar Lo copio y le hago algunas modificaciones

~~~js
export const mostrarListadoChecklist =async (tareas) =>{

    const choices = tareas.map((tarea, indice)=>{
        
        const idx = `${indice + 1 }`.green 
        
        
        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn ) ? true : false //de esta manera muestra las que ya están completadas marcadas
        }
    })

    const preguntas = [
        {
            type: 'checkbox', //tipo checkbox
            name: 'ids',
            message: 'Selecciones ',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(preguntas)

    return ids
 }
~~~
----

## Marcar cómo completadas o pendientes

- Creo en Tareas el método para recibir el arreglo de tareas y establecerlas completadas

~~~js
    toggleCompletadas(ids= []){
        ids.forEach(id=>{
            const tarea = this._listado[id] //al trabajar con un objeto puedo ir directamente a la propiedad que me interesa
            if(!tarea.completadoEn){
                tarea.completadoEn = new Date().toISOString() //no puedo almacenar el objeto Date propiamente pero si toISOString
            }
        })
    }
~~~

- En app.js

~~~js
case '5':
    const ids = await mostrarListadoChecklist(tareas.listadoArr)
    tareas.toggleCompletadas(ids)
break;
~~~

- Si ahora desmarco una completada como no completada sigue apareciendo completadda porque falta la lógica

~~~js

    toggleCompletadas(ids= []){
        ids.forEach(id=>{
            const tarea = this._listado[id] //al trabajar con un objeto puedo ir directamente a la propiedad que me interesa
            if(!tarea.completadoEn){
                tarea.completadoEn = new Date().toISOString() //no puedo almacenar el objeto Date propiamente pero si toISOString
            }
        })

        
         //lógica para desmarcar una tarea como completada
        this.listadoArr.forEach(tarea=>{
            if(!ids.includes(tarea.id)){
                //se puede hacer en una sola linea
                this._listado[tarea.id].completadoEn = null
            }
        })
    }
~~~
