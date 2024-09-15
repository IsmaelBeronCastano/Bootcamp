// - Las reglas son
//   - Cualquier célula *viva* **con menos de dos vecinos** **muere**, por poca población
//   - Cualquier célula *viva* **con más de tres vecinos vivos muere**, por superpoblación
//   - Cualquier célula *viva* con dos o tres vecinos vivos sigue viva en la siguiente generación
//   - Cualquier célula *muerta* **con exactamente tres vecinos resucita**
import {Cell} from "../core/cell"
import { CellStatus } from "../core/cell"


describe('El juego de la vida', ()=>{
    let numberOfNeighbors: number= 0

    it("cualquier celula viva muere con menos de dos vecinas", ()=>{
    
     expect(new Cell(CellStatus.Alive).regenerateNew(numberOfNeighbors= 1).isAlive()).toBe(false)
     expect(new Cell(CellStatus.Dead).regenerateNew(numberOfNeighbors= 1).isAlive()).toBe(false)

    })

    it("cualquier celula vive con dos vecinas vivas sigue viva", ()=>{

     
     expect(new Cell(CellStatus.Alive).regenerateNew(numberOfNeighbors= 2).isAlive()).toBe(true)
     expect(new Cell(CellStatus.Alive).regenerateNew(numberOfNeighbors= 3).isAlive()).toBe(true)
     expect(new Cell(CellStatus.Dead).regenerateNew(numberOfNeighbors= 2).isAlive()).toBe(false)

    })

    it("cualquier celula viva con más de 3 vecinas muere por superpoblación", ()=>{
   
     
     expect(new Cell(CellStatus.Dead).regenerateNew(numberOfNeighbors= 4).isAlive()).toBe(false) 
     expect(new Cell(CellStatus.Alive).regenerateNew(numberOfNeighbors= 4).isAlive()).toBe(false)
   
    })
    it("Una celula muerta con tres celulas vecinas vivas revive", ()=>{
 
     expect(new Cell(CellStatus.Dead).regenerateNew(numberOfNeighbors= 3).isAlive()).toBe(true)
        
    })
})