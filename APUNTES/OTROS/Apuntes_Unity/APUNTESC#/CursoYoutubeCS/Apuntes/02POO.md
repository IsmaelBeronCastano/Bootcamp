# POO EN C#

- Modificadores de acceso:
    - public: accesible desde cualquier parte
    - private: accesible solo desde la propia clase
    - protected: accesible desde clase derivada
    - internal: accesible desde el mismo ensamblado
    - protected internal: accesible desde el mismo ensamblado o clase derivada de otro ensamblado
    - private protected: accesible desde la misma clase derivadao clase derivada del mismo ensamblado
    - por defecto: accesible desde el mismo paquete

- Clase: modelo donde se redactan las características comunes de un grupo de objetos
    - Por ejemplo la clase coche: comparte el chasis, las ruedas, el volante
    - Los objetos es ya cada coche individual con sus propiedades características
    - Los objetos tienen propiedades y comportamiento ( qué es capaz de hacer )
        - El comportamiento son métodos/funciones: un coche sería acelerar, frenar, arrancar, etc.
    - En C# se accede a las propiedades con la notación de punto
- Los objetos tienen un estado incial, comportamiento y propiedades

> Coche.rojo = "red"

> Coche.arranca()
-----

## POO II Creación de clases e instancias

- Creación de clases y objetos/instancias
    - Creo una clase dentro del namespace fuera de la clase Program
    - Por la encapsulación, no podría acceder a los métodos y propiedades de mi círculo al ser de otra clase si no fuera por el modificador
    - Le añado la palabra public al método
    - Yo no debo de poder cambiar el valor de PI, agrego const delante del double
    - Tampoco debería ser accesible desde fuera de su ámbito (Circulo). Le agrego private
~~~cs
using System;

namespace EjemplosPOO
{
    class Program
    {
        static void Main(string[] args)
        {
            Circulo miCirculo; //Creación de objeto de tipo Circulo

            miCirculo = new Circulo(); //Iniciación de variable objeto de tipo Circulo / Instanciación de una clase/ Creación de ejemplar de clase 

            //para poder acceder al método desde otra clase (Program) tiene que ser public
            double areaCirculo = miCirculo.calculoArea(5);

            Console.WriteLine($"El área del círculo es {areaCirculo}");

            Console.WriteLine(miCirculo.calculoArea(3));


        }
    }

    class Circulo
    {
        private const double PI= 3.1416; //ES UNA CONSTANTE, propiedad de Circulo. Se les llama también campos de clase

       public double calculoArea(int radio)
        {
            return radio*radio*PI;
        }
    }
}
~~~
----

## POO III 

- Encapsulación y convenciones
- Las clases estarán conectadas entre si de una u otra forma
- En muchos casos, unas no tendrán porqué saber del funcionamiento de otras ni tener acceso
- Eso es encapsulación
- Poniendo la palabra private delante de la declaración de la variable o método la hago inaccesible desde fuera de la clase
- Si no se indica nada es private, pero por convención se recomienda escribir private para mayor legibilidad
. Para poder acceder a la variable private es recomendable crear un método de acceso en la misma clase

~~~cs
    public void cambiarValor(double nuevoValor)
    {
        euro = nuevoValor;
    }
~~~

- Para llamarlo uso obj.cambiarValor
- Convenciones:
    - Los identificadores "public" deben comenzar con letra mayúscula

> public double CalculoArea() {...}

- Los que no deben ser CamelCase
-------

## CONSTRUCTORES

- Los constructores tienen como finalidad darle a un objeto un estado inicial 
- El constructor tiene el **mismo nombre que la clase**
- Es un poco especial porque no devuelve ningún valor pero tampoco es void
- Lo hago **public** para poder acceder a él desde fuera de la clase
- Lo que yo coloque dentro de las llaves es el estado incial, que comportamientos va a tener, que propiedades iniciales

~~~cs
 class Coche
 {
    public Coche()
    {
        ruedas = 4;  //el uso del this se explicará más adelante
        puertas = 5;
    }


    private int puertas;
    private int ruedas;

    public int getPuertas()  //esto es un getter, me da la información de una propiedad
    {
        return puertas;
    }

 }
 ~~~

 - Con la palabra new lo que hago es llamar al constructor

 > Coche coche1 = new Coche(); //creo una instancia de Coche en el objeto tipo Coche

 - Puedo acceder a los metodos de los objetos como Equals, GetHashCode, GetType, Tostring pero no a las propiedades como .puerta
    - Si creo la clase coche1 en el Main y las propiedades están en otra clase y son private no voy a poder acceder
    - La mejor manera **antes que declarar una propiedad public es crear un método** para obtener su valor
        - Es un getter
        - Un setter es **un método public para modificar una propiedad private**
- Si necesitas crear objetos con diferentes estados iniciales se puede hacer **sobrecarga de constructores**
- Se crea varios constructores con el mismo nombre con diferente numero de parámetros

~~~cs
 class Coche
 {
    public Coche()
    {
        ruedas = 4;  //el uso del this se explicará más adelante
        puertas = 5;
        largo= 2300.5;
        ancho= 0.800;
    }

    public Coche(double largoCoChe, double anchoCoche)
    {
        ruedas= 4;
        largo= largoCoche;
        ancho= anchoCoche;
    }


    private int puertas;
    private int ruedas;
    private double largo;
    private double ancho;

    public int getPuertas()  //esto es un getter, me da la información de una propiedad
    {
        return puertas;
    }

 }
 ~~~

- Si ahora llamo al constructor con parámetros (double) estoy llamando al segundo constructor
- Cuando una clase no tiene constructor, se dice que tiene **constructor por defecto**
----

## Getters y Setters

- getters y setters
- uso del this
- Dividir (Split) las clases largas
- Creo un setter para setear si el coche tiene tapicería.
    - Los setter no tienen return. Son de tipo void. Solo modifican
    - Suelen empezar por set
    - Los setters suelen tener su getter correspondiente para acceder a la info de las propiedades
~~~cs
 class Coche
 {
    public Coche()
    {
        ruedas = 4;  //el uso del this se explicará más adelante
        puertas = 5;
        largo= 2300.5;
        ancho= 0.800;
    }

    public Coche(double largoCoChe, double anchoCoche)
    {
        ruedas= 4;
        largo= largoCoche;
        ancho= anchoCoche;
    }


    private int puertas;
    private int ruedas;
    private double largo;
    private double ancho;
    private string tapiceria;
    private bool climatizador;


    public int getPuertas()  //esto es un getter, me da la información de una propiedad
    {
        return puertas;
    }
    public void setExtras(bool paramClimatizador, string paramTapiceria){  //metodo setter
            climatizador = paramClimatizador;
            tapiceria = paramTapiceria;
    }


    public string getExtras() //getter
    {
        return "Extras del coche; \n" + "Tapiceria: "+ tapiceria + "Climatizador: "+ climatizador;  
    }

 }
~~~
- el valor por defecto de un bool es **false**
- el valor por defecto de un string es **una cadena vacía**
- Si llamo a los parámetros del setter setExtras igual que las propiedades, voy a tenr que hacer referencia a esas propiedades con el **this**

~~~cs
public void setExtras(bool climatizador, string tapiceria){  //metodo setter
            this.climatizador = climatizador;
            this.tapiceria = tapiceria;
     }
~~~

- Para dividir una clase en trozos (cuando es muy larga) se usará **la palabra reservada partial y las llaves**

~~~cs
 partial class Coche
 {
    public Coche()
    {
        ruedas = 4;  //el uso del this se explicará más adelante
        puertas = 5;
        largo= 2300.5;
        ancho= 0.800;
    }

    public Coche(double largoCoChe, double anchoCoche)
    {
        ruedas= 4;
        largo= largoCoche;
        ancho= anchoCoche;
    }

 }

 partial class Coche
 { 
    private int puertas;
    private int ruedas;
    private double largo;
    private double ancho;
    private string tapiceria;
    private bool climatizador;


    public int getPuertas()  //esto es un getter, me da la información de una propiedad
    {
        return puertas;
    }
    public void setExtras(bool paramClimatizador, string paramTapiceria){  //metodo setter
            climatizador = paramClimatizador;
            tapiceria = paramTapiceria;
    }


    public string getExtras() //getter
    {
        return "Extras del coche; \n" + "Tapiceria: "+ tapiceria + "Climatizador: "+ climatizador;  
    }

 }
~~~
--------
## POO VI

- Modularización
    - Para agregar una nueva clase instalar extension C# extensions en VSCode
    - Para crear un proyectp de biblioteca de clases

> dotnet new classlib -o StringLibrary

    - -o especifica la ubicación para la salida generada
    - Para agregar la clase a la solución

> dotnet sln add StringLibrary/StringLibrary.csproj
-----

## POO VII

- Llamadas y clase Math
- Creo una nueva clase llamada Punto

~~~cs
class Punto
{
    public Punto(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
    public Punto()
    {
        this.x = x;
        this.y = y;
    }

    private int x, y;
}
~~~

- En la clase Program creo el método realizarTarea
- Para llamarlo lo haría en el Main, pero como estoy en VSCode puedo hacerlo directamente porque estoy en la clase Program
~~~cs
   
        static void realizarTarea()
        {
            Punto origen= new Punto(); // usa el constructor sin parámetros que seta x, y = 0
            Punto destino = new Punto(128,50);

        }
~~~

- Ahora tengo dos puntos, uno de origen seteado a 0 y otro con unas coordenadas
    - x = 0 == extremo izquierdo de la pantalla
    - y = 0 == extremo superior de la pantalla
- Para calcular la distancia entre el punto de origen y el de las coordenadas destino uso Math
    - Creo un método dentro de Punto. Lo pongo public para que sea accesible dentro de la clase principal
    - En explorador api .NET (google) están todas las clases de las bibliotecas de clases que se pueden usar en C#
    - sqrt es para hacer raices cuadradas, .pow halla la potencia de un número, devuelve un double
    - el teorema de pitágoras dice que el cuadrado de la hipotenusa = la suma del cuadrado de los catetos
~~~cs 

      
using System;

        static void realizarTarea()
        {
            Punto origen= new Punto();
            Punto destino = new Punto(150,90);
            
            double distancia = origen.distanciaHasta(destino); //origen tiene x, y = 0 por el constructor sin parámetros
                                //en el método se observa que hace referencia a this.x (=0) - destino.x (=150)
            Console.WriteLine(distancia);   

        }

        realizarTarea();


class Punto
{
    public Punto(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
    public Punto()
    {
        this.x = x;
        this.y = y;
    }

    private int x, y;

    public double distanciaHasta(Punto otroPunto) //recibe un parámetro de tipo objeto (Punto)
    {
        int xDif= this.x - otroPunto.x;
        int yDif = this.y - otroPunto.y;

        double distanciaEntreDosPuntos = Math.Sqrt(Math.Pow(xDif,2)+ Math.Pow(yDif,2)); //Teorema de Pitágoras
                                                //raíz cuadrada de la suma de los dos catetos elevados al cuadrado
        return distanciaEntreDosPuntos;
    }
}
~~~
----

## POO VII

- Variables y constantes static
- Métodos static
- Cuando creo una variable en una clase e instancio varios objetos de esa clase, esa misma variable es independiente en cada objeto
- En cambio, si le añado el modificador static a la variable de la clase, en cada objeto/instancia de la clase se apuntará a la misma variable
- Los objetos no son poseedores de esa variable, lo es la clase
    - A las variables static se les suele llamar variables de clase
    - Entonces los objetos no pueden actuar sobre la variable de clase, solo la clase

    NOTA: el orden de los modificadores no importa. Por convención primero el modificador de acceso (private/public/protected) luego static y luego el tipo de dato
- Cuando yo quiero que solo la clase Padre pueda usar el método le coloco static. Los objetos instanciados de esa misma clase no podrán acceder a él
- A las variables estáticas no hace falta añadirles const, ya que C# asume que lo son
----

## POO IX

- Importar métodos static
- Clases Anónimas
    - Clases anónimas se suelen usar para abreviar código y hacer querys en SQL
- Si voy a estar usando repetidamente la clase Math, puedo usar la directiva using y ahorrarme escribir Math. cada vez

> using static System.Math;

- Pongo static porque es un método estático de la clase Math
- Puedo hacer lo mismo con Console

> using static System.Console;

- La sintaxis de la clase anónima es la siguiente
- Prescindo de los paréntesisi en el constructor y le agrego los campos entre llaves
    - El tipo lo determina el compilador según el campo que le asignes: string, int, float....
- Uso la palabra var

~~~cs
var miVariable = new {Nombre = "Juan", edad= 16}

Console.WriteLine(miVariable.nombre);
~~~

- El nombre de la clase no es miVariable, esta es una variable donde almaceno la clase anónima
- El compilador le da un tipo a esta variable, yo no lo voy a saber pero da igual
- Si yo creo un objeto con los mismos campos, aunque sean anónimas pertenecen a la misma clase
- El orden, el tipo y el nombre de los campos determina si son de la misma clase

~~~cs
var miVariable = new {Nombre = "Juan", edad= 16}
var miOtraVariable = new {Nombre = "María", edad= 26} //Las dos pertenecen a la misma clase

miVariable = miOtraVariable; //Puedo asignarlos porque son del mismo tipo, al tener los mismos parámetros en el constructor de la clase anónima
~~~

### Restricciones de las clases anónimas

- Sólo pueden contener campos públicos
- Todos los campos deben estar iniciados
- Los campos no pueden ser static
- No se pueden definir métodos
------


- 