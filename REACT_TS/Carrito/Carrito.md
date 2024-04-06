# REACT_TS - Carrito

- Apuntes de lógica para un carrito de compra (no se le prestará atención a estilos ni componentes)
- Primero se hará en JS y luego se migrará a TS
- Usaremos Tailwind
- Creo la db de guitarras en un archivo .js, no usaré las imágenes (aunque están mapeadas)
-----

## Creando componente para cada guitarra

- Creo los states en App
    - Los hooks no pueden estar en iteraciones ni declararse dentro de funciones
    - Siempre colocarlos fuera del return del componente y en la parte superior
- Con un useEffect renderizo todas las guitarras de la db
    - Puedo tener if's dentro de un useEffect, pero hooks de forma condicional no 
- Creo el componente Guitar y le paso la data 

~~~js
import React from 'react'

const Guitar = ({data}) => {
  return (
    <div className="col-md-6 col-lg-4 my-4 row align-items-center">
       {/* <div className="col-4">
            <img className="img-fluid" src={`./img/${data.image}.jpg`} alt="guitarra" />
        </div>*/}
        <div className="col-8">
            <h3 className='text-black fs-4 fw-bold'>{data.name} </h3>
            <p>{data.description}</p>
            <p className="text-yellow-400">${data.price} </p>
            <button className="btn btn-dark w-100 bg-purple-500"
                type="button"
            >
                Agregar al carrito
            </button>
        </div>
    </div>
  )
}

export default Guitar
~~~

- También puedo desestructurar las props price, id, name, image, description directamente en Guitar
- Uso .map para renderizar las guitarras
- Al usar .map debo usar el key. Uso el id

~~~js
import { useState } from "react"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

export const App = ()=>{

  const [data,setData] = useState(db)



  return(
    <>
    <main className="container-xl mt-5">

      <h1 className="text-red-500 text-center font-bold text-xl">Carrito</h1>
      <div className="row mt-5">
        {
          data.map(item=>(
            <Guitar data={item} key={item.id} />

          ))
        }
      </div>
    </main>
    </>
  )
} 
~~~
----

## Eventos JSX

- Creo la función handleClick en Guitar, la coloco en el onClick del button de Agregar al Carrito y le paso el id
- Como le paso un parámetro uso un callback, para que espere el evento y no lo llame en automático

~~~js
<button className="btn btn-dark w-100 bg-purple-500"
        type="button"
        onClick={()=>handleClick(data.id)}
    > Agregar al carrito
</button>
~~~
-----

## State Carrito

- Creo el state cart en App
- Lo inicio como un arreglo para disponer de ciertos métodos
- Le agrego la prop setCart a Guitar para pasarle el setCart desde App
- En el setState tengo el state previo en un callback
- Uso el spread para no perder el state anterior y le añado el nuevo

~~~js
import React from 'react'

const Guitar = ({data, setCart}) => {

    const handleClick =(guitar)=>{
        setCart(prevState=> [...prevState, guitar])
    }

  return (
    <div className="col-md-6 col-lg-4 my-4 row align-items-center">
       {/* <div className="col-4">
            <img className="img-fluid" src={`./img/${data.image}.jpg`} alt="guitarra" />
        </div>*/}
        <div className="col-8">
            <h3 className='text-black fs-4 fw-bold'>{data.name} </h3>
            <p>{data.description}</p>
            <p className="text-yellow-400">${data.price} </p>
            <button className="btn btn-dark w-100 bg-purple-500"
                type="button"
                onClick={()=>handleClick(data)}
            > Agregar al carrito
            </button>
        </div>
    </div>
  )
}

export default Guitar
~~~

- Puedo llamar al setState directamente en el onClick y hacer lo mismo con el prevState
----

## Agregando guitarras al carrito

- Debo verificar que el producto no esté ya en el carrito, para que en lugar de que aparezca múltiples veces, sume la cantidad
- Necesitaré el index. Usaré findIndex
- Para comprobar la inmutabilidad de los métodos está la web **Does it Mutate**
- En caso de que no exista me devolverá -1, en caso de que exista me devolverá la posición
- Si el elemento existe incrementamos la cantidad
- Como no puedo mutar el state directamente me hago una copia con el spread operator y se lo paso al setState
- Si el findIndex no lo encuentra (devuelve -1) seteo la quantity a 1 y se lo paso al state

~~~js
import { useState } from "react"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

export const App = ()=>{

  const [data,setData] = useState(db)
  const [cart, setCart] = useState([])

  function addTocart(item){
    const itemExists = cart.findIndex(guitar=>guitar.id === item.id)

    if(itemExists >= 0){
      const updatedCart = [...cart]
      cart[itemExists].quantity ++
      setCart(updatedCart)
    }else{
      item.quantity = 1
      setCart([...cart, item ])
    }


  }


  return(
    <>
    <main className="container-xl mt-5">

      <h1 className="text-red-500 text-center font-bold text-xl">Carrito</h1>
      <div className="row mt-5">
        {
          data.map(item=>(
            <Guitar data={item} key={item.id} setCart={()=>addTocart(item)} />

          ))
        }
      </div>
    </main>
    </>
  )
} 
~~~
-------

## Mostrando los contenidos del carrito

- Creo el componente Carrito, le paso Cart

~~~js
import React from 'react'

const Carrito = ({cart}) => {
  return (
    <div
    className="bg-slate-400 w-72 h-72 absolute"
    >
    {cart.map(guitar=>(
        <div key={guitar.id}>
        <p>{guitar.name}</p>
        <p>{guitar.price}</p>
        <button className="bg-black text-white" >+</button>
        <p>{guitar.quantity}</p>
        <button className="bg-black text-white block">-</button>
        <button className="bg-red-500 text-white">X</button>
        
        
        </div>
    ))}    

    </div>
  )
}

export default Carrito
~~~

- Si el carrito está vacio quiero mostrar "El carrito está vacío"

~~~js

~~~

--------


