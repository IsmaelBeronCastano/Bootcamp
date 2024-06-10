# DELEGADOS PREDICADOS Y LAMBDAS

- Que son los delegados
- Funciones que delegan tareas en otras funciones
- Muy similares a los pauntadores de C++
- Un delegado es una referencia a un método
- Muy utilizados patra llamar a eventos
- Se reduce el código
- Codigo muy reutilizable;

> delegate tipo NombreDelegado(argumentos)  //Podrá llamar solo a métodos con la misma estructura

- Si el método es de tipo void, el delegado está obligado  a aser void.
- Lo mismo con los argumentos. Si no tiene, el delegado tampoco, y si tiene, el mismo número y tipo

~~~cs
class MensajeBienvenida
{   
    //al hacerlo static no voy a necesitar una instancia de la clase
    public static SaludoBienvenida()
    {
        Console.WriteLine("Hola, acabo de llegar");
    }

}

class MensajeDespedida
{   
    //al hacerlo static no voy a necesitar una instancia de la clase
    public static SaludoDespedida()
    {
        Console.WriteLine("Hola, ya me marcho");
    }

}

//Un delegado puede hacer referencia a un método en diferentes clases, diferentes archivos



delegate void ObjetoDelegado(); //Si el método tuviera un parámetro habría que indicarlo aquí. Como hacer que este delegado apunte al método?

//Main

ObjetoDelegado ElDelegado = new ObjetoDelegado(MensajeBienvenida.SaludoBienvenida); //apuntando al método

ElDelegado();

Eldelegado = new ObjetoDelegado(MensajeDespedida.Saludodespedida); //apunta al otro metodo

ElDelegado();
~~~

## DELEGADOS PREDICADOS Y LAMBDAS II

- Delegados Predicados
- Son delegados que devuelven true o false
- Muy usados para filtrar listas de valores comprobando si una condición es cierta paraunvalor dado
- Sintaxis
~~~cs
 Predicate<T> NombrePredicado = new Predicate<T>(funcionDelegado);
~~~

- Para filtrar los numeros pares de una Lista

~~~cs
using System;
using System.Collections.Generic;

namespace DelegadosPredicados
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> listaNumeros = new List<int>();

            ListaNumeros.AddRange( new int[]{1,2,3,4,5,6,7,8,9,10}); //para introducir un array en la lista uso AddRange

            //Declarar delegado predicado

            Predicate<int> elDelegadoPred = new Predicate<int>(DamePares);
            //Un método de List es FindAll, y pide como parámetro un predicado

            List<int> numPares = listaNumeros.FindAll(elDelegadoPred); //Devuelve una lista de numeros pares

            //para recorrer la lista e imprimirla en consola

            foreach(int numero in numPares)
            {
                Console.Writeline(numero);
            }


        }


        static bool DamePares(int num)
        {
            if(num%2==0) return true;
            else return false;
        }
    }
}
~~~

- Se pueden filtrar objetos más complejos

~~~cs
using System;
using System.Collections.Generic;

namespace DelegadosPredicados
{
    class Program
    {
        static void Main(string[] args)
        {   
            //declaro la lista gente de tio Persona
           List<Persona> gente = new List<Persona>();

            //Instancio persona
           Persona P1 = new Persona("Juan", 23);
           Persona P2 = new Persona("Bulbasur", 32);
           Persona P3 = new Persona("MaryLuz", 43);

        //Agrego el array a la lista
        gente.AddRange(new Persona[]{P1,P2,P3});

        //declaro el predicado
        Predicate<Persona> elPredicado= new Predicate<Persona>(existeJuan);

        //Elmétodo Exists(Predicate<T>) determina si una lista contiene elementos que cumplan las condiciones especificadas por el predicado

        bool existe = gente.Exists(elPredicado); // devuelve un boolean
        }

        //Uso el if para imprimir en consola
        if(existe) Console.WriteLine("Hay personas que se llaman Juan");
        else Console.WriteLine("No hay personas que se llaman Juan");

        static bool ExisteJuan(Persona persona)
        {
            if(persona.Nombre=="Juan") return true;
            else return false;
        }
    }

    class Persona
    {
        public Persona(string nombre, int edad)
        {
            this.nombre = nombre;
            this.edad= edad;
        }

        private string nombre;
        private int edad;

        public string Nombre{get=>nombre; set=> nombre = value}
        public int Edad{get=>edad; set=> edad = value}
    }
}
~~~


-----

## DELEGADOS PREDICADOS Y LAMBDAS III

- Lambdas
- Son funciones anónimas
- Sintaxis

~~~cs
 parametros => CODIGO;
~~~

- Ejemplo

~~~cs
//declaro el predicado
public delegate int OperacionesMatematicas(int numero);

//main

OperacionesMatematicas operacion = new OperacionesMatematicas(num => num*num);

Console.WriteLine(operacion(3)); // me devuelve el cuadrado 9
~~~

- Cuando lambda tiene dos parámetros  o más se meten entre paréntesis

~~~cs
 public delegate int OperacionesMatematicas(int num1, int num2);

 OperacionesMatematicas operacion = new OperacionesMatematicas((num1,num2)=> num1 + num2);
~~~

- Numeros pares con expresión lambda

~~~cs
List<int> numeros = new List<int> {1,2,3,4,5,6,7,8,9,10};

List<int> pares = numeros.FindAll(i => i%2 ==0);

pares.ForEach(num=> Console.WriteLine(num));
~~~

- Cuando el codigo de la expresión lambda tiene varias lineas va entre llaves

~~~cs
pares.ForEach(num=> {
 
 Console.WriteLine("El numero par es:")   
 Console.WriteLine(num);
 
 });
~~~

- Con objetos es lo mismo
- Quiero comparar la edad de dos personas

~~~cs

//declaro el delegado
delegate public bool ComparaPersonas(int edad1, int edad2);

//uso la expresión lambda
ComparaPersonas comparaEdad = (persona1,persona2)=> persona1 == persona2 ;

//le paso las propiedades de las instancias de Persona
Console.WriteLine(comparaEdad(P1.edad, P2.edad)); //false
~~~