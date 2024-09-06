# DIESÑO SOSTENIBLE - 01 Kata Bowling

- Clásico de la comunidad EXTREME PROGRAMMING
- Strike:
  - Derribar todos los bolos en el primer intento
  - Suma 10 puntos + bolos derribados en los próximos 2 lanzamientos
- Spare:
  - Derribar todos los bolos en dos intentos
  - Suma 10 puntos + bolos derribados en el siguiente tiro
- Open Frame: 
  - No derribar todos los bolos en dos intentos
  - Suma bolos derribados en ese turno
- Décimo turno:
  - Jugador con spare o strike tiene lanzamientos adicionales
  - Máximo de tres bolas en este turno
- **PISTAS**
  - La peculiaridad en la puntuación de este juego es el cálculo adelantado para el strike y el spare
  - Cuando se lanza un strike o spare, la puntuación de ese turno queda pendiente hasta uno o dos turnos después
- Algunos casos de prueba sugeridos:
  - 20 lanzamientos, 20 fallos = 0 puntos
  - 20 lanzamientos, 10 pares de 1 = 20 puntos
  - 20 lanzamientos, 1 spare, 1 acierto, 17 fallos = 10 + 5 +5 = 20
  - 19 lanzamientos, 1 strike, 2 aciertos (2 y 3), 16 fallos = 10 + 2 +3 +2 3 = 20
  - 12 lanzamientos, 12 strikes, = 10 turnos * 30 puntos = 300
  - 21 lanzamientos, 10 pares de 5 y spare con un 5 final = 10 turnos * 15 puntos = 150
  - 21 lanzamientos, 10 spares de 8-2 con un 8 final = 10 turenos *18 puntos = 180
------

## Kata Bowling

- Empiezo desde lo más sencillo
  - Creo una clase del juego y hago que el test pase comprobando que game sea una instancia de la clase

~~~js
class BowlingGame{

}

describe('The Bowling Game', ()=>{

    it('should be able to create a bowling', ()=>{
        const game = new BowlingGame()

        expect(game).toBeInstanceOf(BowlingGame)
    })
})
~~~

- Una vez comprobado que el test compila y todo funciona, comprobemos que podemos lanzar una bola

~~~js
class BowlingGame{
    public rolls: number[] = []
    
    public roll (bolos: number){
        this.rolls.push(bolos)
    }
}

describe('The Bowling Game', ()=>{

    it('should be able to create a bowling', ()=>{
        const game = new BowlingGame()

        expect(game).toBeInstanceOf(BowlingGame)
    })

    it('should be able to roll a ball', ()=>{
        const game = new BowlingGame()
        //en el atributo roll iremos almacenando los bolos
        game.roll(0)
        expect(game.rolls).toEqual(0)
    })
})
~~~

- En este punto hay cierta duplicidad del código. Podemos mover la partida a la función beforeEach

~~~js
class BowlingGame{
    public rolls: number[] = []
    
    public roll (bolos: number){
        this.rolls.push(bolos)
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
        expect(game.rolls).toEqual(0)
    })
})
~~~

- Llegadas hasta aquí, podemos hacer la prueba de que todas las bolas se han ido por el canal (no hemos derribado ningúnb bolo)
- Creamos un array con las 20 tiradas y usamos el forEach para indicar que el número de bolos es 0

~~~js
class BowlingGame{
    public rolls: number[] = []

    public calculateTotalScore(){
        return 0;
    }
    public roll (bolos: number){
        this.rolls.push(bolos)
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
        Array.from({length:20}).forEach(()=>game.roll(0))
        expect(game.calculateTotalScore()).toBe(0)
    })
})
~~~

- Puedo parametrizar la creación del array y los tiros en una función

~~~js
//juego en el que todo son fallos
it('calculates the score for a given gutter game', ()=>{

    rollMany()
    expect(game.calculateTotalScore()).toBe(0)
})

//dejo la función fuera de la prueba pero dentro del scope de describe para poder usarla en otras pruebas
//la coloco abajo del todo

function rollMany(times: number = 20, pins: number = 0){
    Array.from({length:20}).forEach(()=>game.roll(pins))

}
~~~

- Caso en que en todos los turnos de la partida solo tiramos un bolo 

~~~js
it('should return only one pin', ()=>{
        rollMany(20,1)
        expect(game.calculateTotalScore()).toBe(20)
    })
~~~

- Para calcular el total puedo usar reduce, que sumará los bolos acumulados

~~~js
public calculateTotalScore(){
    return this.rolls.reduce((acc, current)=> acc + current, 0)
    
}
~~~
------

## Refactor en paralelo

- Un semipleno (con un abola extra para calcular el bonus)

~~~js

it('calculates the score for a given spare and extra ball', ()=>{
    //los dos primeros lanzamientos serían el semipleno
    game.roll(5)
    game.roll(5)
    game.roll(5) //la puntuación del primer turno  sería 20, puesto que el último lanzamiento de 5 (de la bola extra) se cuenta 2 veces (por el spare)
    rollMany(17, 0) //los 17 turnos restantes suman 0

    expect(game.calculateTotalScore()).toBe(20)
})
~~~

- Me he dado cuenta de que recorrer todos los lanzamientos puede complicar el diseño
- Para no romper los tests que tenemos, hago un refcatoring en paralelo
- Lo suyo sería generar los frames y hacer el cálculo a partir del frame en el que estamos
- Para pasar los tests que tenemos hasta ahora debo devolver el score actual más la suma de los 2 lanzamientos

~~~js
frames(){
    return Array.from({length: 10}).map((_, i: number)=> i ) //obtengo el índice
}
~~~

- El estado total del reduce representa el total acumulado en el índice actual
- Debemos devolver el total actual más la suma de los dos lanzamientos del turno
- le sumo dos al índice porque realizamos dos lanzamientos en este turno

~~~js
calculateTotalScoreNew(){
    //para pasar los tests hechos hasta ahora, debemos devolver el totalScore acumulado hasta ahora
    // más los dos lanzamientos del turno
    return this.frames().reduce(({totalScore, frameIndex})=>{ //el estado inicial del reduce representa el total acumulado del indice actual
        return {
            totalScore: totalScore + this.rolls[frameIndex] + this.rolls[frameIndex+1], //le sumo 2 porque son 2 lanzamientos (por ahora)
            frameIndex: frameIndex + 2 //el índice lo incrementamos en 2 porque hemos realizado 2 lanzamientos en este turno
        }
    }, {totalScore: 0, frameIndex: 0}).totalScore //accedo a totalScore para devolverlo
}
~~~

- Llamo el método en calculateTotalScore

~~~js
class BowlingGame{
    public rolls: number[] = []

    public calculateTotalScore(){
       return this.calculateTotalScoreNew()
       
    }
    public roll (bolos: number){
        this.rolls.push(bolos)
    }

    calculateTotalScoreNew(){
        //para pasar los tests hechos hasta ahora, debemos devolver el totalScore acumulado hasta ahora
        // más los dos lanzamientos del turno
        return this.frames().reduce(({totalScore, frameIndex})=>{ //el estado inicial del reduce representa el total acumulado del indice actual
            return {
                totalScore: totalScore + this.rolls[frameIndex] + this.rolls[frameIndex+1], //le sumo 2 porque son 2 lanzamientos (por ahora)
                frameIndex: frameIndex + 2 //el índice lo incrementamos en 2 porque hemos realizado 2 lanzamientos en este turno
            }
        }, {totalScore: 0, frameIndex: 0}).totalScore //accedo a totalScore para devolverlo
    }

    frames(){
        return Array.from({length: 10}).map((_, i: number)=> i ) //obtengo el índice
    }
}
~~~

- También puedo guardar el resultado en una variable explicativa y retornar el totalScore para mejorar la legibilidad
- Puedo tiparlo de esta manera

~~~js
calculateTotalScoreNew(){                                               //Score
    const score = this.frames().reduce(({totalScore, frameIndex}:{totalScore: number, frameIndex: number})=>{             
        return {
            totalScore: totalScore + this.rolls[frameIndex] + this.rolls[frameIndex+1], 
            frameIndex: frameIndex + 2 
        }
    }, {totalScore: 0, frameIndex: 0})

    return score.totalScore
}
~~~

- Puedo crear una interfaz fuera de la clase llamada Score (más reutilizable!)

~~~js
interface Score {totalScore: number, frameIndex: number}
~~~

- En lugar de usar .roll varias veces puedo crear un método sumOfBallsInFrame que calcule la suma de una tirada

~~~js
sumOfBallsInFrame(frameIndex: number){
    return  this.rolls[frameIndex] + this.rolls[frameIndex +1]
}
~~~

- Creo un nuevo método que calcula el score por frame
- Ahora si puedo renombrar a claculateTotalScore (sin el New)

~~~js
interface Score {totalScore: number, frameIndex: number}

class BowlingGame{

    public rolls: number[] = []
  
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

    //en lugar de recorrer todas las tiradas lo haremos por frames
    sumOfBallsInFrame(frameIndex: number){
        return this.rolls[frameIndex] + this.rolls[frameIndex +1]
    }

    private calculateScorePerFrame =({totalScore, frameIndex}: Score)=>{
            return {
                totalScore: totalScore + this.sumOfBallsInFrame(frameIndex),
                frameIndex: frameIndex + 2
            }
    }

    frames(){
        return Array.from({length: 10}).map((_, i: number)=> i ) //obtengo el índice
    }
}
~~~

- Ahora todavía no pasa el test, porque le he dicho que el resultado es 20 y solo suma 15!

~~~js
it('calculates the score for a given spare and extra ball', ()=>{
    //los dos primeros lanzamientos serían el semipleno
    game.roll(5)
    game.roll(5)
    game.roll(5) //la puntuación del primer turno  sería 15, que son los 10 puntos + los conseguidos en la primera bola del siguiente 
    rollMany(17, 0) //los 17 turnos restantes suman 0

    expect(game.calculateTotalScore()).toBe(20)//suma 20 porque la bola extra después del spare suma doble
})
~~~
----

## Calculando el semipleno

- Si el frame suma 10, retorno el totalScore + 10 + la puntuación de la bola extra

~~~js
private calculateScorePerFrame =({totalScore, frameIndex}: Score)=>{
    if(this.rolls[frameIndex]+ this.rolls[frameIndex+1] === 10){
        return {
            totalScore: totalScore +10 + this.rolls[frameIndex+2],
            frameIndex: frameIndex + 2 
        }
    }
        return {
            totalScore: totalScore + this.sumOfBallsInFrame(frameIndex),
            frameIndex: frameIndex + 2
        }
}
~~~

- Refactorizamos creando dos métodos y usando una constante explicativa para el número 10

~~~js
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

    frames(){
        return Array.from({length: 10}).map((_, i: number)=> i ) //obtengo el índice
    }
}
~~~

- Refactorizamos el test para que uede más claro

~~~js
it('calculates the score for a given spare and extra ball', ()=>{
    rollSpare()
    game.roll(5) 
    rollMany(17, 0) //los 17 turnos restantes suman 0

    expect(game.calculateTotalScore()).toBe(20)//suma 20 porque la bola extra después del spare suma doble
})


function rollMany(times: number = 20, pins: number = 0){
    Array.from({length:20}).forEach(()=>game.roll(pins))

}

function rollSpare(){
    game.roll(5)
    game.roll(5)
}
~~~
----

## Calculando el pleno

- Vamos a comprobar que se clacula el strike y 2 bolas extras
- El strike suma 10 y las dos bolas extras 3 +2. Total 15 para el primer turno
  - La puntuación para toda la partida serían 20, ya que el segundo turno se cuenta dos veces

~~~js
it('calculates the score for 1 strike and 2 extra ball', ()=>{
    //strike
    game.roll(10)
    //2 bolas extras
    game.roll(2)
    game.roll(3)
    rollMany(16, 0)
    expect(game.calculateTotalScore()).toBe(20)
})
~~~

- Con el test en rojo, hacer que pase es muy sencillo
- En el método debemos evaluar si se ha hecho un strike 

~~~js
 private calculateScorePerFrame =({totalScore, frameIndex}: Score)=>{

        if(this.rolls[frameIndex] === this.maxScorePerFrame){
            return {
                totalScore: totalScore + this.maxScorePerFrame + this.rolls[frameIndex +1] + this.rolls[frameIndex+2],
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
~~~

- Igual que hicimos antes, extraemos las dos operaciones a dos métodos, uno que calcule si es un strike y otro que sume las dos bolas extras

~~~js
 private isStrike(frameIndex: number){
        return this.rolls[frameIndex] === this.maxScorePerFrame
    }

    private strikeBonus(frameIndex: number){
        return this.rolls[frameIndex +1] + this.rolls[frameIndex+2]
    }
~~~

- Los aplicamos

~~~js
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
~~~

## El juego perfecto

- Trabajemos sobre el décimo turno. Tenemos 12 tiradas de 10 puntos
- Con el código implementado hasta ahora, este test PASA! (porque está bien hecho jeje)

~~~js
it('calculates the score for a given perfect game, 12 rolls of 10 points each one', ()=>{
    //hacemos un pleno en los 9 primeros
    //después otro pleno y dos 10 en el último cuadro
    rollMany(12, 10)

    expect(game.calculateTotalScore()).toBe(300)
})
~~~

- Ahí va la kata bowling

~~~js
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
~~~