export enum CellStatus{
    Dead= 0,
    Alive =1
}

export class Cell {

    
    constructor(readonly status: CellStatus){
    }

     regenerate (numberOfNeighbours: number): CellStatus{
        return this.status === CellStatus.Alive
        ? this.statusForAliveCell(numberOfNeighbours)
        : this.statusForDeadCell(numberOfNeighbours)

    }

    regenerateNew(numberOfNeighbours: number): Cell{
        const nextStatus = this.status === CellStatus.Alive
        ? this.statusForAliveCell(numberOfNeighbours)
        : this.statusForDeadCell(numberOfNeighbours)

        return new Cell(nextStatus)
    }

    isAlive(){
        return this.status === CellStatus.Alive
    }

    private statusForAliveCell(numberOfNeighbors: number){
       let isStablePopulation= numberOfNeighbors ==2 || numberOfNeighbors === 3
            return isStablePopulation
            ? CellStatus.Alive
            : CellStatus.Dead

    }

    private statusForDeadCell(numberOfNeighbors: number){
       let isFertilePopulation = numberOfNeighbors === 3 
       
       return isFertilePopulation 
       ? CellStatus.Alive
        : CellStatus.Dead

    }

}