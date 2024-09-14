# DISEÑO SOSTENIBLE - 02 Kata Juego de la Vida

- Esta kata vendrá bien para practicar código simple
- Es una partida de 0 jugadores
- La máquina juega sola en un sistema llamado autómata celular
- Configuramos un patrón inicial en una matriz, y ejecutando el programa, el sistema evoluciona la matriz a través de generaciones
- Se llama el juego de la vida porque su creador quería replicar el ciclo de la vida
- Representa la vida de la siguiente manera
- Una cuadricula de células, unas estan vivas y otras estan muertas
- Cada célula tiene 8 células vecinas, en horizontal, vertical y en las diagonales
- Este patrón simple puede generar patrones cvomplejos gracias a una regla simple
- Puede ser representado bidimensionalmente pero también por cualquier cosa, un fluido, un cubo tridimensinal...
- Las reglas son
  - Cualquier célula *viva* **con menos de dos vecinos** **muere**, por poca población
  - Cualquier célula *viva* **con más de tres vecinos vivos muere**, por superpoblación
  - Cualquier célula *viva* con dos o tres vecinos vivos sigue viva en la siguiente generación
  - Cualquier célula *muerta* **con exactamente tres vecinos resucita**
- Normalmente las reglas las manda quien hace la kata
------

## Juego de la vida

- Empezaremos por implementar que cualquier celula viva muere con menos de dos vecinos
- La célula vamos a diseñarla que tiene dos estados: viva o muerta
- Lo presentamos como una enumeración
- La célula solo va a tener el método público regenerate
- Escribo lo necesario para que el test pase

~~~js
enum CellStatus{
    Dead= 0,
    Alive =1
}

class Cell {

    
    constructor(readonly status: CellStatus){
    }

    regenerate(numberOfNeighbors: number){
       
        return CellStatus.Dead
    }
}

describe('El juego de la vida', ()=>{

    it("cualquier celula viva muere con menos de dos vecinas", ()=>{
        let cell = new Cell(CellStatus.Alive)
        let numberOfNeighbors = 1
        let nextStatus= cell.regenerate(numberOfNeighbors)
        
        expect(nextStatus).toBe(CellStatus.Dead)
    })
})
~~~

- Refactorizo solo a una línea de código
- Incluyo la condición de si hay mas de dos vecinas vivas, devuelve una célula viva

~~~js
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
        }
       
        return CellStatus.Dead
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
        
    //añado una tercera  que pasa el test pero debería devolver .Alive
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 3)).toBe(CellStatus.Dead)

    })
})
~~~

- Hagamos el test de con más de tres células muere por superpoblación

~~~js
   it("cualquier celula viva con más de 3 vecinas muere por superpoblación", ()=>{
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
     
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
   
    })
~~~

- Ahora cualquier célula muerta que tenga 3 vecinos resucita.
- Lo más sencillo es añadir un else

~~~js
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
            
           
        }else{
            if(numberOfNeighbors ===3){
                return CellStatus.Alive
            }
        }
        
        return CellStatus.Dead
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
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 3)).toBe(CellStatus.Dead)
    })
    it("cualquier celula viva con más de 3 vecinas muere por superpoblación", ()=>{
     expect(new Cell(CellStatus.Dead).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
     
     expect(new Cell(CellStatus.Alive).regenerate(numberOfNeighbors= 4)).toBe(CellStatus.Dead)
   
    })
})
~~~

- Así fallan los tests anteriores.
- Los corregimos, para eso son los tests, son una red de seguridad

~~~js
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
~~~
------

## Refactorizando la célula

- Tenemos la lógica básica de las células implementada


