# INTERFACES

- Sintaxis
- Una interfaz es un conjunto de directrices que deben cumplir las clases
- Las clases pueden implementar las interfaces que queramos
- Es parecido a una clase, pero solo estan las definiciones de las propiedades y métodos
    - Es como una plantilla, marca el diseño de una clase
- Seguimos con el ejemplo de los animales
    - Creo la clase ballena quehereda de mamíferos

~~~cs
class Ballena: Mamiferos
{
    public Ballena(string nombreBallena): base(nombreBallena)
    {

    }

    public void nadar()
    {
        Console.WriteLine("Soy capaz de nadar")
    }
}
~~~

- Imaginar que quiero obligar a otros desarrolladores a especificar cuantas patas tiene ese animal que hereda de la clase Mamiferos 
- Puedo crear el método en la clase Mamiferos, pero sería una solución a medias, ya que Ballena no tiene patas y es un mamífero
- Una solución es la interfaz, donde incluir este método, y decidir quien implementa esta interfaz y quien no
    - Una convención es que las interfaces empiecen por una i mayúscula
    - Dentro de la interfaz defino los métodos, no lo desarrollo. Simplemente se declara. No llevan modificador de acceso
    - Por convención en C# los métodos empiezan con mayúscula pero es solo una convención

~~~cs
interface IMamiferosTerrestres
{
    int numeroPatas();
}
~~~

- Ballena no debería implementar esta interfaz, pero caballo si
- Primero la clase y seguido de una coma la interfaz ( puede implementar varias interfaces)
- De esta manera obligo a desarrollar el método declarado en la interfaz
    - El nombre, el tipo de dato a devolver, los parametros (tipo y numero) deben coincidir exactamente con el que se definió en la interfaz

~~~cs
class Caballo : Mamiferos, IMamiferosTerrestres
{
    public Caballo (string nombreCaballo): base(nombreCaballo)
    {

    }

    public int numeroPatas()
    {
        return 4; // cada clase que implemente la interfaz IMamiferosTerrestres deberá desarrollar su propio método numeroPatas
    }
}
~~~
----

## INTERFACES II y III

- Clases que implementan varias interfaces
- Interfaces con varios métodos
- Interfaces con métodos iguales
- Que ocurre cuando implementas varias interfaces con el mismo método
- Puedo crear una interfaz para obligar a definir que animales son abusados para deportes

~~~cs
interface IAnimalAbusoDeporte
{
    string tipoDeporte();
}
~~~

- En un gorila o una ballena no tiene sentido implementar esta interfaz, pero en un caballo si
- No se admite la herencia multiple de clases pero si de interfaces

~~~cs
class Caballo : Mamiferos, IMamiferosTerrestres, IAnimalAbusoDeporte
{
    public Caballo (string nombreCaballo): base(nombreCaballo)
    {

    }

    public int numeroPatas()
    {
        return 4; // cada clase que implemente la interfaz IMamiferosTerrestres deberá desarrollar su propio método numeroPatas
    }

    public string tipoDeporte()
    {
        return "Hípica"
    }
}
~~~

- Pongamos que quiero que especifiquen que sean si es un deporte olímpico o no.
    - Creo otro método en la interfaz IAnimalAbusoDeporte 

> boolean esOlimpico();

- Debo desarrollar el método esOlimpico() en la clase Caballo
- Si yo quiero implementar unmétodo de aquellos animales que pueden saltar no puedo implementarlo en mamíferos, porque los hay que no pueden
    - Para eso sirve la interface, para obligar a tener que determinar un comportamiento a aquellas clases específicas que implementen la interfaz
~~~cs
interface ISaltoConPatas
{
    int numeroPatas(); //Tiene el mismo nombre, tiene los mismos argumentos y devuelve el mismo tipo que el método definido en la interfaz IMamiferosTerrestres
}
~~~

 - Caballo (que implementa el método de IMamiferosTerrestres) también implementa este segundo método llamado igual en ISaltoConPatas
 - Cómo resolver esta ambigüedad?
 - Retirando el modificador de acceso y usando la notación de punto 

~~~cs
class Caballo : Mamiferos, IMamiferosTerrestres, IAnimalAbusoDeporte, ISaltoConPatas
{
    public Caballo (string nombreCaballo): base(nombreCaballo)
    {

    }

    // las interfaces IMamiferosTerrestres y ISaltoConPatas tienen un método con el mismo nombre
     int IMamiferosTerrestres.numeroPatas()   //prescindo del modificador de acceso (public,etc) y uso la notación de punto 
    {
        return 4;
    }

      int ISaltoConPatas.numeroPatas()    
    {
        return 2;
    }

    public string tipoDeporte()
    {
        return "Hípica"
    }
}
~~~

- Porqué he tenido que quitar public de numeroPatas?
- Si es accesible fuera de esta clase, cuando llamo al método, a cual me refiero? por eso se le quita el modificador public
- Pero si se puede llamar desde fuera, hay que usar el método de sustitución de Liskov "es-un"
- Puedi crear un objeto en base a una interfaz

~~~cs
Caballo miBabieca = new Caballo("Babieca");

IMamiferosTerrestres ImiBabieca = miBabieca; //principio de sustitución es-un

//Ahora puedo llamar con este objeto al método numeroPatas de la interfaz IMamiferosTerrestres

Console.WriteLine("Babieca tiene "+ ImiBabieca.numeroPatas() + " patas."); //4
~~~

- Restricciones del uso de interfaces
    - No se permite definir variables, solo métodos
    - No se pueden definir constructores
    - No se pueden definir destructores ( se verá más adelante)
    - No se pueden especificar modificadores de acceso en los métodos. Son todos public por defecto
    - No se pueden anidar otro tipo de estructuras dentro (como una clase)
-----
