import { useState } from "react"
import Guitar from "./components/Guitar"
import { db } from "./data/db"
import Carrito from "./components/Carrito"

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

  const showCart=()=>{
    return(
      <Carrito />
    )
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

      <div>
        <Carrito cart={cart} />
      </div>
    </main>
    </>
  )
} 