import {heroes} from '../data/heroes'

export const findHeroById= (id: number)=>{
    return heroes.find(heroe=> heroe.id == id)
}