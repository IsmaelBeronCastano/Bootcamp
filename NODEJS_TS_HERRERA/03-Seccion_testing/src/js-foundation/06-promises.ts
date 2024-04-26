import { httpClient as http} from "../plugins";

export const getPokemonById = async( id: string|number ):Promise<string> => {
  
  try {
    
    const url = `https://pokeapi.co/api/v2/pokemon/${ id }`;
  
    const pokemon = await http.get( url );
    
    return pokemon.name;

  } catch (error) {
    
    throw 'Pokemon no existe!'
    
  }  
  // const resp = await fetch( url );
  // const pokemon = await resp.json();


  
  
  // return fetch( url )
  //   .then( ( resp ) => resp.json())
  //   // .then( () => { throw new Error('Pokemon no existe') })
  //   .then( ( pokemon ) => pokemon.name );

}


