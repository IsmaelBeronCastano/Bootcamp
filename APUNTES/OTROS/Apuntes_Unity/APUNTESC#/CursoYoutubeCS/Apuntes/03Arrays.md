# 03 ARRAYS

- Un array es una estructura de datos que contiene elementos de un mismo tipo
- Usados para almacenar valores que normalmente tienen relación entre si
- Sintaxis: tipo de dato, corchetes, nombre del array


~~~cs
int[] miMatriz; //declaración de array

//asignacion de array
miMatriz = new int[4]; //va a almacenar 4 numeros enteros en su interior. En este momento tiene 4 valores por defecto (4 ceros) 
                       // si fuera un objeto los valores por defecto son null, string también, null
// miMatriz = [0,0,0,0] 

//asignacion de valores a cada una de las posiciones del array
miMatriz[0]= 15;
miMatriz[1]= 20;
miMatriz[2]= 12;
miMatriz[3]= 13;

//Puedo dejar una posición vacía, tendrá el valor por defecto
~~~

- Puedo declarar directamente el array o almacenar los datos de manera dinámica

~~~cs
int[] miMatriz={1,2,3,4};
~~~

- Si quiero acceder o almacenar una posición que no existe aparece un error en consola

> System.IndexOutOfRangeException

- Hay otras estructuras más complejas que permiten almacenar varios valores
- Hay otra sintaxis simplificada para almacenar un array cuando ya sabes los elementos

~~~cs
int edades = [14,23,35,43]; //Puedes agregar más valores en esta declaración
~~~
- Hay otra manera
~~~cs
int[] edades = new int[5] {13.23.43.54}; //Restringes el array a 5 valores
~~~
------

## Arrays II

- Arrays implicitos
- Arrays de objetos
- Arrays de tipos anónimos
- Recorrdio y acceso de array con bucle for

~~~cs

//array implicito. Sin tipo de dato ni numero de elementos usando la palabra var
var datos = new []; 

//puedo añadirle datos con llaves

var datos2 = new[] {1,2,3,4, "15"}; // de esta manera si mezclo valores tipo string con int ( por ejemplo) ME DA ERROR

// DE ESTA MANERA NO
var valores= new [] {12,13,14.32, 15}; //A pesar de tener un valor double, el compilador si sabe determinar el tipo de valores, lo pasa todo a double

//array de objetos

class Empleados
{
    public Empleados(string nombre, int edad)
    {
        this.nombre = nombre;
        this.edad = edad;
    }


    string nombre;
    int edad;
}

Empleados [] arrayEmpleados= new Empleados[2];

arrayEmpleados[0]= new Empleados("Sara", 37);

Empleados Ana = new Empleados("Ana", 27); // Puedo crear el objeto de tipo Empleados con el nombre de Ana y almacenarlo en una posición del array

arrayEmpleados[1]= Ana;

//arrays de tipo anónimo

var personas = new[]
{
    new {Nombre="Juan", edad=39},  //posición 0 del array
    new {Nombre= "Pepita", edad=32},
    new {Nombre="Diana", edad=23}  //el último no lleva coma
}; // al final lleva punto y coma

~~~

## ARRAYS III

- Bucle for

~~~cs
 for(int=0; i<= 8; i++){
    //codigo del bucle for
 }

for (int=0; i<=2; i++)
{
    Console.WriteLine(personas[i]);
}

//ARRAYS IV
//NET Framework class (google)
//una manera más inteligente sería usar la propiedad Length

for (int=0; i<=personas.Length; i++)
{
    Console.WriteLine(personas[i]);
}

//Para recorrer un array de objetos exactamente igual
//En arrayEmpleados las propiedades de la clase Empleados nombre y edad no son accesibles
//Una solución sería cambiar el acceso de las variables a public  NO RECOMENDABLE porque podría acceder desde cualquier lado

//arrayEmpleados[0].nombre= "Leo";

//La manera correcta sería crear iun getter enle clase Empleados para obtener los valors

//Empleados 

public string getInfo()
{
    return "Nombre: " +nombre+ "Edad: "+ edad;
}

//__________
//Main

for (int=0; i<=arrayEmpleados.Length; i++)
{
    Console.WriteLine(arrayEmpleados[0].getInfo());
}

//Uso de forEach, muy útil para recorrer arrays implicitos o de tipos anónimos, donde no sabes el nombre, la posición, etc
//sintaxis: creo un iterador del mismo tipo que almaceno en el array

foreach(Empleados iterador in arrayEmpleados)
{
    Console.WriteLine(iterador.getInfo());
}

//cuando no se de que tipo es el array uso var en el iterador


foreach(var iterador in arrayDesconocido)
{
    Console.WriteLine(iterador);
}
~~~ 
-----

## ARRAYS V

- Arrays cómo parámetros de método
- Arrays cómo devolución de método (return)

~~~cs

static void ProcesaDatos(int[] datos)
{
    foreach(int i in datos) // el foreach solo me sirve para recorrer, si quiero modificar cada valor usaré un bucle for
                            //manipular arrays muta el array por referencia
    {
        Console.WriteLine(i)
    }
}

// creo el array para pasarle al método

int [] numeros = new int[4];

numeros[0]= 1;
numeros[1]= 2;
numeros[2]= 3;
numeros[3]= 4;

//Le paso el array al método en el Main

ProcesaDatos(numeros);

//construir un método para especificarle cuantos elementos quiero en el array y generarlo por consola


static int[] LeerDatos()
{
    Console.WriteLine("Cuantos elementos quieres que tenga el array?")

    string respuesta= Console.ReadLine();

    int numElementos = int.Parse(respuesta);

    int[] datos = new int[numElementos];

    for( int i = 0; i<= datos.Length; i++)
    {
        Console.WriteLine($"Introduce el dato para la posicion: {i}");

        string datoConsola= Console.ReadLine();
        int numero = int.Parse(datoConsola);
        datos[i]= numero;
    }

    return datos;
}
//Guardo en el Main el array que devuelve LeerDatos y lo recorro para imprimirlo en consola
//Como esta en el Main LO EJECUTA, y al ejecutarlo salta el método "Cuantos elementos quieres que tenga el array?"

int[] arrayDatos = LeerDatos(); //Se ejecuta en consola y una vez el array es almacenado lo recorre con un foreach 
foreach(int i in arrayDatos) Console.WriteLine(i);

//Cuando termino el programa de añadir los valores por consola el foreach me los muestra por pantalla
