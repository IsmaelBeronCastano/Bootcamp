# CLASES ABSTRACTAS EN C#

- Qué son y para que sirven?
- Se seguirá el mismo ejemplo que en el ejemplo de mamíferos
- En la clase Mamiferos tengo los métodos respirar(), pensar(), cuidarCrias(), getNombre()
- Los métodos no comunes están en cada clase o implementados a través de una interfaz
    - Ballena tiene nadar()
    - Caballo tiene galopar()
    - Humano tiene pensar()
    - Gorila tiene trepar()
- Humano tiene un pensar distinto al pensar en la clase Mamiferos, igual el Gorila quetiene un pensar más avanzado
- Para especificar en los mamíferos terrestres cuantas patas tienen se hizo uso de las interfaces
- Lo mismo para especificar el salto y si son abusados en deportes olímpicos
- Si ahora yo quiero incluir una clase Lagartija, no es un mamífero.
    - No cuida de sus crias
    - Pensar primitivo, pero tiene
    - Si respira y tiene nombre
- Habría que duplicar código de todas formas, para darle esos métodos a Lagartija
- La solución pasaría por crear una clase superior a Mamíferos que tenga esos métodos (pensar, respirar y getNombre)
    - Por ejemplo esta clase superior a Mamiferos podría llamarse Animales (clase abstracta)
    - El método getNombre en Animales (clase abstracta) no debe de ser igual porque decía "El nombre del mamífero es: "
        - Una manera de solucionarlo es crear un método abstracto, como se hace en las interfaces
        - Solo declararlo, no desarrollarlo. 
    - Ahora estoy obligado a desarrollar en la clases heredadas de Animales el método getNombre
        - En Lagartija 
        - En Mamíferos
    - Siempre que haya en una clase un método abstracto (sin desarrollar) la clase debe de ser abstracta
    - Este método deberá desarrollarse en la clase heredera siguiente
- Porqué se le llama clase abstracta? Tiene que ver con el concepto de abstracción
    - Cual es la clase más capaz/especializada? suele ser las clases más abajo de la jerarquía
    - La clase que está más arriba de la jerarquía suele ser abstracta, como la clase Personas con las subclases empleados, jefes, etc  
----

## CLASES ABSTRACTAS II

- Para crear una clase abstracta se usa la palabra abstract

~~~cs
abstract class Animales
{

    public void respirar()
    {
        Console.WriteLine("Soy capaz de respirar");
    }

    public abstract void getNombre(); //las clases que hereden estarán obligadas a desarrollar este método
}

class Mamiferos: Animales
{
    public Mamiferos(string nombre)
    {
        nombreSerVivo = nombre;
    }

    public override void getNombre() //estoy obligado a escribir override para sobreescribir el método
    {
        Console.WriteLine("El nombre del mamífero es: "+ nombreSerVivo);
    }

    public virtual void pensar()
    {
        Console.WriteLine("Pensar básico instintivo");
    }

    private string nombreSerVivo;

}

class Lagartija: Animales
{
    public Lagartija(string nombre)
    {
        nombreReptil = nombre;
    }

    public override void getNombre(){
        Console.WriteLine("El nombre del reptil es: "+ nombreReptil);
    }

    private string nombreReptil;
}

Lagartija Nick = new Lagartija("Nick");

Nick.respirar(); //metodo desarrollado en la clase Animales
Nick.getNombre();//método desarrollado en la clase Lagartija pero declarado abstracto en la clase abstracta Animales
~~~
-----

# CLASES SELLADAS

- Que son las sealed classes y los métodos sealed
- Hay ocasiones en las que se tiene claro que hay clases que no deben ser extendidas (que tengan herencia)
- Una sealed class es una clase de la que no se puede heredar
- Lo mismo ocurre con los métodos. Con un método sealed, las subclases herederas no podrán sobreescribirlo
- Sintaxis

~~~cs
//Si no quiero que haya clases herederas de Lagartija le coloco la palabra sealed

sealed class Lagartija: Animales
{
    public Lagartija(string nombre)
    {
        nombreReptil = nombre;
    }

    public override void getNombre(){
        Console.WriteLine("El nombre del reptil es: "+ nombreReptil);
    }

    private string nombreReptil;
}
~~~


