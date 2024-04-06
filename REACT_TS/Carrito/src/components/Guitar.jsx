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