# 01 Basics React Typescript Grider

- Cuando vamos a pasar props a un componente hijo, **defino una interfaz con las props que el hijo espera recibir**
- Creo dos componentes para el ejemplo: Parent y Child
- Creo la interfaz para las props del hijo. Desestructuro color

~~~js
interface ChildProps{
    color: string
}

export const Child = ({color}: ChildProps) => {
  return (
    <div>{color}</div>
  )
}

export default Child
~~~

- Parent component

~~~js
import Child from "./Child"


export const Parent = () => {
  return (
    <Child color="red"/>
  )
}

export default Parent
~~~

- Le paso el Parent Component a App.tsx para renderizarlo en pantalla
-----

## Explicit Component Type Annotations

- Todos los componentes de React pueden tener estas propiedades:
  - propTypes
  - displayName
  - defaultProps
  - contextTypes
- Por ejemplo, yo puedo decir que

> Child.displayName = "kjashks"

- Typescript no sabe que estamos creando un componente de React, por lo que piensa que Child no tiene esas propiedades
- React.FC, FC de Functional Component. Se puede escribir React.FunctionalComponent
  - Esta es otra manera de definir componentes en React con Typescript

~~~js
interface ChildProps{
    color: string
}

export const Child = ({color}: ChildProps) => {
  return (
    <div>{color}</div>
  )
}

export const ChildAsFC: React.FC<ChildProps>=({color})=>{
    return <div>{color}</div>
}
~~~

- De esta manera le decimos a Typescript:
  - Child será un componente de React
  - Child tendrá propiedades como propTypes o displayName
  - Child recibirá las propiedades de tipo ChildProps
- Esta manera de declarar componentes es útil cuando quiero acceder a las propiedades inherentes en todo componente de React
-------
 **NOTA:** Para la versión 18 de React, se removió como implícita la propiedad children de React.FC. Se debe incluir en la interfaz

## Annotations with Children

- Pongamos que le quiero pasar en el evento onClick del botón una función desde las propiedaes del componente

~~~js


interface ChildProps{
    color: string,
    onClick: ()=> void,
    children?: React.ReactNode
}


export const ChildAsFC: React.FC<ChildProps>=({color, onClick})=>{
    return(
        <div>
            {color}
            <button onClick={onClick}>Click me</button>
        </div>     

    )      
}
~~~
- Todo lo que coloque dentro del componente se considera **children**

~~~js
import {ChildAsFC} from "./Child"


export const Parent = () => {
  return (
    <ChildAsFC color="red" onClick={()=>console.log("hello!")}>

        Texto children----> children
    </ChildAsFC>
  )
}
~~~
- Con esta notación de React.FC no da error al agregar children ( con la primera manera si) porque lo soporta sin problema
- Si quiero usar children debo declararlo en la interfaz manualmente
- Child.tsx
 
~~~js
interface ChildProps{
    color: string,
    onClick: ()=> void,
    children?: React.ReactNode 
}

export const Child = ({color, onClick, children}: ChildProps)=>{
    return(
        <div>
            {color}
            {children}
            <button onClick={onClick}>Click me</button>
        </div>
    )
}

                                            
export const ChildAsFC: React.FC<ChildProps>=({color, onClick, children})=>{
    return(
        <div>
            {color}
            <button onClick={onClick}>Click me</button>
            <p>{children}</p>
        </div>     
    )      
}
~~~

- Parent.tsx

~~~js
import {ChildAsFC} from "./Child"


export const Parent = () => {
  return (
    <ChildAsFC color="red" onClick={()=>console.log("hello!")}>
     Texto children
    </ChildAsFC>
  )
}
~~~
-----

## State with Typescript

- Vamos a hacer una lista con un inupt y un botón e imprimirla en pantalla
- Todo dentro del mismo componente
- Si no voy a recibir props no hace falta colocar los brackets
- De esta manera escribe en pantalla lo que escribo en el input
- No hay mucha diferencia de un componente escrito con JS

~~~js
import { useState } from "react"


const List: React.FC = () => {

    const [name,setName]= useState('')

  return (
    <div>
        <h1>Party List</h1>
        <p>{name} </p>
        

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button>Add</button>

    </div>
  )
}

export default List
~~~
----

## Type Inference with State

- Quizá deberíamos tener un array de strings que alamcene los nombres
- Creo un nuevo state, declaro que es un array de strings con los brackets
- Tomo una copia del array existente de guests y le añado el nombre
- Uso .map para recorrer guests dentro de una ul y con un return imprimo cada guest en un li ( no olvidar el  key!!)

~~~js
import { useState } from "react"


const List: React.FC = () => {

    const [name,setName]= useState('') //Si declaro un string vació en el state, Typescript infiere en el tipo del state

    const [guests, setGuests] = useState<string[]>([]) //asi le digo que mi state será un array de strings

    const handleGuests =()=>{
        setName('')

        setGuests([...guests, name]) //tomo el array existente de guests y le añado el nuevo nombre
    }

  return (
    <div>
        <h1>Party List</h1>

        <ul>     
            {guests.map((guest)=>{
               return <li key={guest}>{guest} </li>    
            })}

        </ul>
        
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={handleGuests}>Add</button>

    </div>
  )
}

export default List
~~~
--------

## More on state

- Vamos a crear un componente User Search
- El cascarón:

~~~js
const FindUser: React.FC = () => {
  return (
    <div>
        <h1>Find User</h1>

        <input type="text" />
        <button>Find</button>

        <div>

        </div>
    </div>
  )
}

export default FindUser
~~~

- Le añado una lista de usuarios hardcodeada
- Uso la función find con el array para encontrar el usuario.

~~~js
import { useState } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    const [name, setName]= useState('')

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })
    }

  return (
    <div>
        <h1>Find User</h1>

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>

        </div>
    </div>
  )
}

export default FindUser
~~~

- Tengo que manejar si el usuario no existe
- Debo añadir otro state para almacenar el usuario
- Si trato de buscar un usuario que no existe me devuelve *undefined*
- Entonces, user (como estado) puede ser *undefined*, o un objeto con name: string y age: number
- Utilizo el operador && para decirle que solo imprima user.name si user es un valor truthly

~~~js
import { useState } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    const [name, setName]= useState('')
    const [user, setUser] = useState<{name: string, age: number} | undefined>()

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })

        setUser(foundUser)
    }

  return (
    <div>
        <h1>Find User</h1>

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>
            {user && user.name}
            {user && user.age}
        </div>
    </div>
  )
}

export default FindUser
~~~

- Si el usuario está definido imprimirá el nombre y la edad, si no no imprimirá nada
-------

# 02 Types around Events and Refs React Typescript Grider

- Puedo definir la función del onChange por separado
- Creo en un directorio llamado events en /src el EventComponent.tsx

~~~js
import React from 'react'

const EventComponents: React.FC = () => {
  return (
    <div>
        <input onChange={(e)=>console.log(e)} />
    </div>
  )
}

export default EventComponents
~~~

- Lo renderizo en App
- Cada cosa que escribo en el input que hay en pantalla se imprime en consola
- Lo que quiero es definir la función por separado
- Cuando uso el callback *(e => console.log(e))* directamente no me aparecía el error de tipado en el evento
- Ahora que hago la función por separado si me lo marca
- Si selecciono con el mouse el < input  y pongo el cursor encima del onChange me dice el tipo de elemento que espera el evento 
- Quizá **se ve más fácil si coloco el cursor encima del e en el callback**, Typescript me dice el tipo de dato que es event es (React.ChangeEvent)
- **RECUERDA:** cuando tenemos una función (callback) cuyo parámetro es el mismo que el primer y único argumento, podemos pasar solo la referencia. Ejemplo:

~~~js
onChange= {(e)=> nuevaFuncion(e)}

//es igual a esto

onChange = {nuevaFuncion}
~~~

- **NOTA:** usar la inferencia de tipos de Typescript para saber qué tipo de dato son las cosas. Typescript siempre está al loro

~~~js
import React from 'react'

const EventComponents: React.FC = () => {
  const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    console.log(e)
  }

  return (
    <div>
        <input onChange={onChange} />
    </div>
  )
}

export default EventComponents
~~~
------

## Handling drag events tool

- Hay otros eventos que vamos a querer manejar en React, como form submission, clicks, drags, etc
- ChangeEvent es solo aplicable a eventos que pueden cambiar, como textInputs, textAreas, radioButtons, checkBoxes, etc
- Coloco un div en EventComponent con el texto Drag Me!. Le añado la propiedad draggable y la función que creo para disparar un evento cuando mueva el elemento
- Cada vez que lo selecciono y lo muevo con el mouse se imprime en consola

~~~js
import React from 'react'

const EventComponents: React.FC = () => {
  const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    console.log(e)
  }

  const onDragStart=()=>{
    console.log("I'm being dragged")
  }

  return (
    <div>
        <input onChange={onChange} />
        <div draggable onDragStart={onDragStart}>Drag Me!</div>
    </div>
  )
}

export default EventComponents
~~~

- Quizá quiero acceder al evento de este componente *draggable*
- Quizá quiero saber en qué dirección ha sido movido, o cuan lejos
- Coloco el cursor encima del atributo onDragStart y veo que es *React.DragEvent < HTMLDivElement >* (sin el Handler!)
- **El tipo del evento DragEventHandler es DragEvent**
- DragEventHandler se refiere al tipo de la función onDragStart mientras que DragEvent se refiere al evento
- Puedo escribirlo de dos formas

~~~js
  const onDragStart:React.DragEventHandler<HTMLDivElement>=(event)=>{
    console.log(event)
  }

  //o también

    const onDragStart=(event: React.DragEvent<HTMLDivElement>)=>{
    console.log(event)
  }
~~~

- Si hago control + click sobre el tipo de evento voy a index.d.ts dónde tengo las definiciones
- Puedo ver que hay otros tipos como *CompositionEvent* (relacionado con autocompletado en moviles), *PointerEvent* (relacionado con el uso de lápices en tablets), *FocusEvent*(relacionado con clicks en elementos), etc
-----

## Applying Types to Refs

- Vamos a hacer que automáticamente haga focus en el input sin necesidad de hacer clic en él
- Creo /src/refs
- Copio el archivo FindUser y lo meto en /refs. Importo useRef
- Declaro inputRef con el useRef y lo coloco en el input. me aparece el error *"MutableRefObject no es asignable a Legacyref"*
- Cuando declaro un ref para un elemento HTML debo indicarle el tipo entre brackets
  - Si hago control + click en HTMLInputElement puedo ver todas las interfaces de elementos HTML
- Cuando creo un useRef, Typescript no sabe si se lo he asignado a algún elemento, puede ser que no y que sea null
  - Por eso le digo que puede ser de tipo null y le paso el valor de null
- src/refs/UserSearch.tsx

~~~js
import { useState, useRef } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    //creo la ref
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [name, setName]= useState('')
    const [user, setUser] = useState<{name: string, age: number} | undefined>()

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })

        setUser(foundUser)
    }

  return (
    <div>
        <h1>Find User</h1>

        <input ref={inputRef} type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>
            {user && user.name}
            {user && user.age}
        </div>
    </div>
  )
}

export default FindUser
~~~

## More on refs

- Para hacer que al renderizar ponga el foco en el input uso un useEffect
- Si hago uso de inputRef.current Typescript me marca un error porque el valor actual puede ser null 

~~~js
useEffect(()=>{
    inputRef.current.focus()
}, [])
~~~

- Para solucionarlo hago una validación

~~~js
useEffect(()=>{
  if(!inputRef.current) return
  inputRef.current.focus()
}, [])
~~~

- En caso de duda de qué tipo de elemento es el de useRef le puedo pasar any
- **RECUERDA:** cuando defines un ref, Typescript es paranoico y considera que **puede no estar asociado a ningún elemento**, por lo que puede ser null
-----