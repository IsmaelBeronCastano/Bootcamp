import {heroes} from './data/heroes'
import { findHeroById } from './services/hero.service'

const hero = findHeroById(2)

console.log(hero)