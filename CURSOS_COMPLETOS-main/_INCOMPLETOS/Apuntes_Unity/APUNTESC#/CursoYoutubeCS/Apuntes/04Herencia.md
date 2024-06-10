# HERENCIA 

- Seguir el principio "es-un"
    - Es un Jefe un Empleado? Si = Jefe hereda de empleado
    - Es un empleado un jefe? NO = Empleado no hereda de jefe
    - Es Director un empleado? SI = Director hereda de empleado
- Uno tiende a poner el Director en la cúspide de la pirámide, pero en este caso es Empleado
- A medida que bajas en la pirámide de herencia, tienden a ser clases más específicas que hacen más tareas que las que se encuentran en la cúspide
- También me podría preguntar: un Director es un Jefe? SI = Jefe hereda de Empleado, Director hereda de Jefe
- Debo preguntarme cuales son las caracteristicas comunes dentro de mi aplicación
    - Todos tienen nombre, edad, fecha de alta en la empresa, salario
    - Comportamientos: todos van a trabajar, todos generan informes
---

## HERENCIA II

- Sintaxis
- Superclasesy subclases
- Clase Object

~~~cs
Humano Pepe = new Humano();

class Mamiferos
{
    public void respirar()
    {
        Console.WriteLine("Puedo respirar");
    }
    public void cuidarCrias()
    {
        Console.WriteLine("Crio mis crias");
    }
}

class Humano: Mamiferos    //HEREDA DE MAMIFEROS, disponible Humano.respirar() y Humano.cuidarCrias
{
    public void pensar()
    {
        Console.WriteLine("Soy capaz de pensar")
    }
}
~~~

- Pepe tiene los métodos de todo objeto: Equals, GetHashCode, GetType, ToString 
    - Equals determina si dos instancias de objeto son iguales
    - ToString devuelve una cadena que representa el objeto actual
    - Hay más que estos 4 pero aparecen con otros modificadores de ascceso, lo que hace que en una cadena de herencia puedas o no acceder a estos métodos 
- Siempre que hagas una jerarquía de herencias, en la cúspide va a estar la clase Object (Superclase cósmica!)
-----

## HERENCIA III

- Constructores en superclases y subclases
- Instrucción base()
    - La instruccion base() llama al constructor de la clase padre
- La subclase siempre llama implicitamente al constructor de la clase padre
    - Por defecto llama a : base() (que llama al constructor por defecto)
- Si creo un constructor en la clase padre ya no puede llamar por defecto a : base, debo dar esa instrucción
~~~cs

Humano Pepe = new Humano("Pepe");

class Mamiferos
{
    public Mamiferos(string nombre)
    {   
        this.nombreSerVivo = nombre;

    }

    public void respirar()
    {
        Console.WriteLine("Puedo respirar");
    }
    public void cuidarCrias()
    {
        Console.WriteLine("Crio mis crias");
    }

    public void getNombre(){
        Console.WriteLine($"El nombre es: {nombreSerVivo}")
    }


    private string nombreSerVivo;
}

class Humano: Mamiferos   
{
    public Humano(string nombreHumano): base(nombreHumano)
    {

    }

    public void pensar()
    {
        Console.WriteLine("Soy capaz de pensar")
    }

}
~~~
- Debo llamar a base con el parámetro del constructor de la clase padre
- Pepe.getNombre() me devuelve el nombre del objeto
-----

## HERENCIA IV

- Principio de sustitución de Liskov en la herencia
    - Barbara Liskov
- Consiste en substituir un objeto de un tipo por uno de otro tipo diferente teniendo en cuenta la jerarquía de herencia
- Principio de sustitución "es siempre un..."
- Un caballo es siempre un humano ? NO, un humano es siempre un caballo? NO, NO HAY HERENCIA
- Un mamífero es siempre un caballo ? NO, un caballo es siempre un mamífero? SI
    - Mamífero estará siempre en la cúspide y debajo a la misma altura caballo y humano
~~~cs
//este codigo da error

Caballo animal = new Mamiferos("Lili"); //ERROR

//este codigo no

Mamiferos animal = new Caballo("Bucéfalo");// un objeto de tipo mamifero puede albergar uno de tipo caballo pero no al revés
                //esto es aplicar el principio de sustitución
~~~

- Así animal solo puede acceder a los métodos de Mamiferos (y los de object, claro)
- También puedo almacenar en una variable de tipo Mamiferos una de tipo Caballo

~~~cs
 Mamiferos animal = new Mamiferos("Bucéfalo");

 Caballo Bucefalo = new Caballo("Bucéfalo");

 animal = Bucefalo;

 Bucefalo = animal; //ERROR, no puedo guardar un mamifero en un caballo. Un mamifero no es siempre un caballo
~~~

- De la clase Object heredan todas las demás, incluidas las clases de .NET

~~~cs
Object animal = new Mamiferos();

Object caballo = new Caballo();
~~~

- Todo es un objeto
- Todo esto para qué sirve?
- Este método de sustitución se utiliza constantemente
    - Necesito crear un array para almacenar Gorila, Humano y Caballo

~~~cs

Mamiferos[] arrayMamiferos = new Mamiferos[3];

    arrayMamiferos[0]= new Humano("Pepe");
    arrayMamiferos[1]= new Gorila("Koko");
    arrayMamiferos[2]= new Caballo("Bucéfalo"); // podría guardar la variable caballo del ejemplo anterior
    
    arrayMamiferos[0].getNombre(); //Devuelve Pepe, solo tengo acceso a los métodos de mamiferos
~~~
------

## HERENCIA V

- Polimorfismo
    - Herencia de métodos: new, virtual y override
- Yo puedo pensar que el método pensar de humano también se le puede atribuir a los gorilas y los caballos
    - Para ello creo el método pensar en la clase Mamiferos

~~~cs
//clase Mamiferos

public void pensar()
{
    Console.WriteLine("Pensamiento básico instintivo");
}
~~~
    - Ahora tengo el método pensar repetido en Humano, este lo sobreescribe al heredado de la clase Mamiferos
    - Esto solo se dá si se llama igual y tiene los mismos parámetros. Si no es sobrecarga
    - Uso new delante del nuevo método pensar para quitar la advertencia del IDE
~~~cs
//Humano
new public void pensar() //ocultación
{
    Console.WriteLine("Soy capaz de pensar");
}
~~~

- Yo puedo pensar que los humanos también tienen ese pensamiento básico instintivo del método pensar de la clase Mamiferos
- Por ello debo declarar en el método de la clase padre la palabra virtual, después del modificador de acceso
- No son métodos independientes, son modificados
~~~cs
//clase Mamiferos

public virtual void pensar()  //con esto le indico que todas las subclases deben de tener un metodo pensar que modifiquen el metodo pensar de Mamiferos
{
    Console.WriteLine("Pensamiento básico instintivo");
}
~~~

- Para definir que se trata de una modificación en el método de la subclase usaré override
    - el Método de la clase padre debe ser declarado como virtual
~~~cs
//Humano

public override void pensar() // Sobreescritura. Con override declaro que es una modificación del método de la clase padre (marcada como virtual)
{
    Console.WriteLine("Soy capaz de pensar");
}
~~~

- Para el ejemplo: el Caballo hereda el metodo pensar de Mamiferos, Gorila tiene su propio método pensar y Humano su propio método pensar
- Si yo hago un bucle for para iterar sobre el array de animales, en cada iteración me mostrará un pensar diferente

~~~cs
for (int i = 0; i< arrayMamiferos.Length; i++ )
{
    arrayMamiferos[i].pensar();
}
~~~

- En ocasiones se comporta como un mamifero, como un humano y como un gorila.
- Esto es el polimorfismo: dependiendo del contexto se comporta de manera diferente
----

## HERENCIA VI

- public Vs private Vs protected
    - Con public puedo acceder desde cualquier otra clase (método o variable)
    - private solo puedo acceder desde la clase. Encapsulación. Para acceder a una variable provate se suele usar un método public
    - protected será accesible desde la propia clase y de las clases que hereden
----
