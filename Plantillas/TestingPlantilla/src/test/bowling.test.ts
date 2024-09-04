interface Score {totalScore: number, frameIndex: number}

class BowlingGame{

    public rolls: number[] = []
    private readonly maxScorePerFrame: number = 10

    public calculateTotalScore(){
       const score = this.frames().reduce(
        this.calculateScorePerFrame,
        {totalScore: 0, frameIndex: 0}
       )
       return score.totalScore
    }
    public roll (bolos: number){
        this.rolls.push(bolos)
    }

    sumOfBallsInFrame(frameIndex: number){
        return this.rolls[frameIndex] + this.rolls[frameIndex +1]
    }

    private isSpare(frameIndex:number){
        return this.rolls[frameIndex] + this.rolls[frameIndex + 1] == this.maxScorePerFrame
    }

    private spareBonus(frameIndex: number){
            return this.rolls[frameIndex + 2]
    }

    private calculateScorePerFrame =({totalScore, frameIndex}: Score)=>{

        if(this.isStrike(frameIndex)){
            return {
                totalScore: totalScore + this.maxScorePerFrame + this.strikeBonus(frameIndex),
                frameIndex: frameIndex + 1
            }
        }

        if(this.isSpare(frameIndex)){
            return {
                totalScore: totalScore + this.maxScorePerFrame + this.spareBonus(frameIndex),
                frameIndex: frameIndex + 2
            }
        }
            return {
                totalScore: totalScore + this.sumOfBallsInFrame(frameIndex),
                frameIndex: frameIndex + 2
            }
    }

    private isStrike(frameIndex: number){
        return this.rolls[frameIndex] === this.maxScorePerFrame
    }

    private strikeBonus(frameIndex: number){
        return this.rolls[frameIndex +1] + this.rolls[frameIndex+2]
    }

    frames(){
        return Array.from({length: 10}).map((_, i: number)=> i ) //obtengo el índice
    }
}

describe('The Bowling Game', ()=>{

    let game: BowlingGame;

    beforeEach(()=>{
        game = new BowlingGame()
    })

    it('should be able to create a bowling', ()=>{
        expect(game).toBeInstanceOf(BowlingGame)
    })

    it('should be able to roll a ball', ()=>{
        
        //en el atributo rolls iremos almacenando los bolos
        game.roll(0)
        expect(game.rolls).toEqual([0])
    })

    //juego en el que todo son fallos
    it('calculates the score for a given gutter game', ()=>{
        rollMany()
        expect(game.calculateTotalScore()).toBe(0)
    })

    it('should return only one pin', ()=>{
        rollMany(20,1)
        expect(game.calculateTotalScore()).toBe(20)
    })

    it('calculates the score for a given spare and extra ball', ()=>{
        rollSpare()
        game.roll(5) 
        rollMany(17, 0) //los 17 turnos restantes suman 0

        expect(game.calculateTotalScore()).toBe(20)//suma 20 porque la bola extra después del spare suma doble
    })

    it('calculates the score for 1 strike and 2 extra ball', ()=>{
        //strike
        game.roll(10)
        //2 bolas extras
        game.roll(2)
        game.roll(3)
        rollMany(16, 0)
        
        expect(game.calculateTotalScore()).toBe(20)
    })

    it('calculates the score for a given perfect game, 12 rolls of 10 points each one', ()=>{
        //hacemos un pleno en los 9 primeros
        //después otro pleno y dos 10 en el último cuadro
        rollMany(12, 10)

        expect(game.calculateTotalScore()).toBe(300)
    })
    
    
    function rollMany(times: number = 20, pins: number = 0){
        Array.from({length:20}).forEach(()=>game.roll(pins))

    }

    function rollSpare(){
        game.roll(5)
        game.roll(5)
    }
})