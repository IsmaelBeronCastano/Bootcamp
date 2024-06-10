# ENUM En C#

- Qué son. Sintaxis y utilidad
- Son un conjunto de constantes con nombre
. Sintaxis

> enum NombreDeEnumeracion {nombre1, nombre2, nombre3};

- Sirven para representar y manejar valores fijos (constantes) en un programa
- Suelen ser declarados dentro de un namespace, para ser usado por varias clases, pero no es obligatorio
~~~cs
enum Estaciones {Primavera, Verano, Otono, Invierno};
                //Estaciones.Primavera = 0, Estaciones.Verano = 1, Estaciones.Otono = 2            

//MAIN

Estaciones alergia = Estaciones.Primavera;

Console.WriteLine(alergia); //Primavera. Primavera NO ES un string. Para pasarlo a string tengo que usar toString()

string LaAlergia = alergia.toString(); //Ahora si es un string

//Puedo querer almacenar un valor null en un tipo enum

Estaciones? alergia = null; //esto no da error
~~~

- Ejemplo con Bonus para empleado

~~~cs
enum Bonus {bajo=500, normal=1000, bueno=1500, extra=3000};

Bonus Antonio = Bonus.bajo;

Console.WriteLine(Antonio); //bajo

//Si quiero imprimir el valor y no bueno tengo que hacer un casting

double bonusAntonio = (double)Antonio;

Console.WriteLine(bonusAntonio); //500
~~~

