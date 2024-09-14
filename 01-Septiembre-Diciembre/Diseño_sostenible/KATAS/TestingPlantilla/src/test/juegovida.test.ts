// - Las reglas son
//   - Cualquier célula *viva* **con menos de dos vecinos** **muere**, por poca población
//   - Cualquier célula *viva* **con más de tres vecinos vivos muere**, por superpoblación
//   - Cualquier célula *viva* con dos o tres vecinos vivos sigue viva en la siguiente generación
//   - Cualquier célula *muerta* **con exactamente tres vecinos resucita**



enum CellStatus{
    Dead= 0,
    Alive =1
}

class Cell {

    
    constructor(readonly status: CellStatus){
    }

    regenerate(numberOfNeighbors: number){
        if(this.status === CellStatus.Alive ){
            if(numberOfNeighbors === 2 || numberOfNeighbors ===3){
                return CellStatus.Alive
            }
         return CellStatus.Dead
            
           
        }else{
            if(numberOfNeighbors ===3){
                return CellStatus.Alive
            }
            return CellStatus.Dead
        }
        
    }
}

describe('El juego de la vida', ()=>{
    let numberOfNeighbors: number= 0

    it("cualquier celula viva muere con menos de dos vecinas", ()=>{
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 1)).toBe(CellStatus.Dead)
     //cuando parte de la celula muerta 
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 1)).toBe(CellStatus.Dead)
    })

    it("cualquier celula vive con dos vecinas vivas", ()=>{
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 2)).toBe(CellStatus.Alive)
     
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 3)).toBe(CellStatus.Alive)
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)

    })

    it("cualquier celula viva con más de 3 vecinas muere por superpoblación", ()=>{
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
     
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
   
    })
    it("Una celula muerta con tres celulas vecinas vivas revive", ()=>{
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 3)).toBe(CellStatus.Alive)
        
    })
})