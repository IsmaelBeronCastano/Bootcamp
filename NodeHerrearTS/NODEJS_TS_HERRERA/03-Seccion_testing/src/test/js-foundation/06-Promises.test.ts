import { getPokemonById } from "../../js-foundation/06-promises"

describe('06-Promises', ()=>{


    test("Should return a pokemon", async()=>{

        const pokemonId = 1

        const pokemonName = await getPokemonById(pokemonId)

        expect(pokemonName).toBe('bulbasaur')

     })

     test('Should return an error if pokemon does not exists', async()=>{
            const pokemonId=12345678
            

            try {
                const pokemonName= await getPokemonById(pokemonId)
                expect(true).toBe(false)
                
            } catch (error) {
                expect(error).toBe('Pokemon no existe!')
            }

     })
})