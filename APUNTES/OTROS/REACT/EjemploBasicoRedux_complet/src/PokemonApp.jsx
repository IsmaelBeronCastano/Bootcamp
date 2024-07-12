import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from './store/slices/pokemon'

const PokemonApp = () => {
  
  const dispatch = useDispatch()
  

  useEffect(()=>{

    dispatch(getPokemons())

  },[])
  
  const {isLoading, pokemons, page} = useSelector( state => state.pokemons)

 
  
  return (
    <>
        <h1>Pokemon App</h1>
        <br />
        <span> Loading: {isLoading ? "true": "false"}</span>

        <ul>
          {pokemons.map(pokemon=>(
            <li key={pokemon}>{pokemon.name}</li>
          ))}
        </ul>

        <button onClick = {()=>dispatch(getPokemons(page))}>Next Page</button>

    </>
  )
}

export default PokemonApp