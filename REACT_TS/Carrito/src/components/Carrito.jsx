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