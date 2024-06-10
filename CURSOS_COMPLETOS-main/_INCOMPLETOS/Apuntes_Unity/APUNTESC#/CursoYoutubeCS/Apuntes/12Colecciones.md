# COLECCIONES EN C#

- Que son las colecciones
- Trabajo con colecciones de tipo List
- Las colecciones son unas clases que pertenecen aun namespace en concreto, **System.Collection.Generic**
- Clases que permiten almacenar elementos de tipo genérico
- Son clases genéricas
- Nos permiten saltarnos las limitaciones de los arrays a cambio de consumir mas recursos
- Permiten:
    - Ordenar los elementos
    - Añadir (en tiempo de ejecución)
    - Eliminar
    - Buscar, etc,
- Colecciones más frecuentes (hay más)
    - List<T>: parecidos al array pero con métodos adicionales
    - Queue<T>: Las colas. Un elemento entra y uno sale. Primero en entrar- primero en salir (como la cola de un super)
    - Stack<T>: Parecido a las Queue pero con diferencias. Primero en entrar-último en salir
    - LinkedList<T>: Comportamiento como Queue o Stack pero con acceso aleatorio
    - HashSet<T>: Lista de valores sin ordenar
    - Dictionary<Tkey,Tvalue>: Almacena elementos con estructuras de clave-valor
    - StoredList<Tkey,Tvalue>: igual que el Dictionary pero ordenados
- Se va a tratar la colección List<T>
    - Buscando en google en .NET por la clase System.Collection.Generic
    - Vemos que tiene sobrecarga de constructores (tiene 3 constructores)
    - Propiedades: Capacity, Count, Item[Int32]
    - Métodos: un montón, Add, indexOf, Reverse, etc.

~~~cs
using System;
using System.Collection.Generic;

//Main

List<int> numeros = new List<int>(); // declarar una coleccion de tipo lista

numeros.Add(32); //agregar un elemento

int[] listaNumeros = new int[] {3,4,5,6};

for(int i = 0; i < listaNumeros.Count; i++)//añado los numeros a la lista. Uso la propiedad Count para obtener el numero de elementos
{
    numeros.add(listaNumeros[i]);
}

for(int i = 0; i < numeros.Count; i++) //recorre la lista para mostrarla en pantalla
{
    Console.WriteLine(numeros[i]);
}
~~~

- Un programa que nos pida por consola cuántos elementos queremos almacenar en la colección y después vaya preguntando que elementos queremos almacenar
- Si le decimos 7 elementos, cuando hayamos rellenado el último entiempo de ejecución terminará de rellenarse la colección

~~~cs
Console.WriteLine("Cuantos datos quieres introducir ?");

int elem = Int32.Parse(Console.ReadLine());

for(int i = 0; i< elem; i++)
{
    numeros.Add(Int32.Parse(Console.ReadLine()));
}

Console.WriteLine("Los elementos introducidos son: ")

for (int i = 0; i< numeros.Count; i++)
{
    Console.writeLine(numeros[i]);
}
~~~

- La propiedad Count nos dice cuántos elementos tiene una lista
- Para listar puedo usar un foreach

~~~cs
foreach(int elemento in numeros)
{
    Console.WriteLine(elemento)
}
~~~

- Para remover un elemento tenemos RemoveAt(Int32), donde se le indica el ínidce del objeto a borrar en la Lista
----

## COLECCIONES II

- Colección LinkedList (listas enlazadas)
- Sintaxis y funcionamiento
- La diferencia entre LinkedList y List es de eficiencia
- En las listas cada elemento se almacena en una posición adyacente de la memoria
    - Esto implica que si eliminamos un elemento, queda esa posición vacía pero eso no puede ser, tienen que ser adyacentes
    - Por lo que todos los datos posteriores al elemento eliminado son movidos en la lista una posición arriba para cubrir esa posición vacía
    - Esto puede dar problemas de eficiencia
- Las LinkedList funcionan diferentes, están formadas por nodos.
    - Los nodos tienen unos polos/vertices/enlaces que conectan conel siguiente elemento y con el anterior
    - Estos nodos son objetos que pertenecen a la clase LinkedListNode<T>
    - Una LinkedList es una colección de LinkedListNode. La entrada del primero apunta a null, igual que la salida del último nodo
    - Con la LinkedList no hace falta que los datos se almacenen en posiciones adyacentes de la memoria
    - Ahora cuando borro un elemento, se linkean los nodos necesarios. Esto es mucho más eficiente

~~~cs
using System;
using System.Collection.Generic;

//Main

LinkedList<int> numeros = new LinkedList<int>(); //Consulto en la documentación los prámteros del constructor

foreach(int numero in new int[]{10,43,4,6,7,77,5,4})
{
    numeros.AddFirst(numero); //lA cada bucle lo va a agregar el primero, por lo que imprimirá el array al revés
                              //También tengo AddLast() para que agregue en orden (para que vaya agregando al último)
}

foreach(int numero in numeros)
{
    Console.WriteLine(numero);
}

//Otra manera de recorrerlo sería esta, complicandolo mucho
for(LinkedListNode<int> nodo=numeros.First; nodo !=null; nodo= nodo.Next)
{
    int numero= nodo.Value;

    Console.WriteLine(numero);
}

//Hay varios tipos de Remove: Remove(T), Remove(LinkedListNode<T>), RemoveFirst(), RemoveLast()

numeros.Remove(6); //Indico el elemento a eliminar

LinkedListNode<int> nodoImportante = new LinkedListNode<int>(15);

numeros.AddFirst(nodoImportante); //puedo usar uno de los constructores que me permite usar nodos

//Puedo crear un nodo para agregarlo a diferentes colecciones
~~~
----

## COLECCIONES III

- Colecciones Queue(colas)
    - F.I.F.O: primero en entrar- primero en salir
    - Se agregan de forma seciuencial en orden
    - Para eliminar se eliminarían en el mismo orden en el que entraron. Si primero entró el verde, será el primero en eliminarse
    - Muchas veces el procesador dedica el 100%  del proceso para terminar la lista de tareas almacenadas en la cola.
    - La primera tarea que entró debe realizarse para pasar a la siguiente
- Consultar en la documentación .NET

~~~cs
using System;
using System.Collection.Generic;


Queue<int> numeros = new Queue<int>();


//rellenando o agregando elementos a la cola

foreach(int numero in new int[5]{1,2,3,4,5,6})
{
    numeros.Enqueue(numero);// por cada numero entero del array agregalo a la queue numeros
}

//numeros.Dequeue() elimina el primer elemento que entró en la cola (en este caso 1)
//Peek() devuelve un objeto al principio del Queue
~~~
-----

# COLECCIONES IV Stacks y Dictionary

- Colección Stack
    - L.I.F.O: Last in First Out
- Colección Dictionary
    - Elementos con clave-valor
- Para introducir elementos en un stack se usa Push() y para eliminar el Pop()
- Se eliminará el último en entrar 

~~~cs
using System;
using System.Collection.Generic;


Stack<int> numeros = new Stack<int>();

foreach(int numero in new int[3]{1,2,3,4})
{
    numeros.Push(numero); //Devuelve 4,3,2,1 COMO UNA PILA DE PLATOS
}

//eliminar con .Pop(), eliminaría el 4
~~~

- Diccionarios
- Muy útiles para DB's
- Consumen más recursos de programación
- Se agregan elementos con Add

> Add(Tkey, Tvalue)

~~~cs
using System;
using System.Collection.Generic;

Dictionary<string,int> edades = new Dictionary<string,int>();

//rellenar el diccionario se puede con Add y con una sintaxis parecidas a los arrays

edades.Add("Pedro", 32);

//Añadir valor al diccionario con sintaxis de array
edades["Juan"] = 23;

//Recorrer el diccionario

foreach(KeyValuePair<string,int> persona in edades)
{
    Console.WriteLine("Nombre: {0} Edad: {1}", persona.Key, persona.Value);
}







~~~