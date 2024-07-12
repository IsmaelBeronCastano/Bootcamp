# 01 CURSO DE C#

## SINTAXIS BÁSICA

- Para crear una aplicación de consola con C# en Visual Studio Code
    - Instalar extension C# en VSC
    - Escribir dotnet new console (esto creará los archivos necesarios)
    - En Program.cs escribirás tu código
    - Para correrlo dotnet run en el directorio donde está el proyecto (CAMBIAR PERMISOS EN LA CARPETA TEMP para correr el programa)

- La sentencia using System; es para usar esta librería y no estar escribiendo System.Console.WriteLine("") para imprimir en consola
- Solo se usará Console.WriteLine("")
- namespace es para delimitar el uso de nombres de las variables a ese scope
- El método Main ejecuta el código, void es que no retorna nada, static es un método que pertenece a la misma clase donde es declarado
    - A la hora de llamar un método static no se debe usar ningún objeto en la llamada
    - Main es el punto de entrada para ejecutar una aplicación en C#
    - Debe de ser static porque en el momento de ejecutar el programa no he creado ningún objeto.
    - Cómo no hay ningún objeto que pueda llamar almétodo Main, debe de ser llamado sin necesidad de utilizar un objeto
~~~cs
using System;

namespace Practica
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hola Mundo");
        }
    }
}


~~~
---
### Tipos de datos

- Tipos: por valor y por referencia
- Tipos por valor
    - Primitivos: enteros, reales, booleanos ( y utf16)
    - Estructuras
    - Enumerador
- Enteros: sin decimales
    - Con signo y sin signo. Con signo son solo los positivos, sin signo pueden ser negativos y positivos
    - Con signo:
        - sbyte
        - short
        - int
        - long
    - Sin signo:
        - byte: desde -127 a 128
        - ushort
        - uint: largo
        - ulong: muy largo
- Reales:
    - float: decimal
    - double: decimal más largo
    - decimal: decimal aún más largo
- Boolean:
    - true
    - false
- Los más usados son:
    - int: 32 bits (Tamaño usado en la RAM)
    - long: 64 bits
    - float: 32 bits
    - double: 64 bits
    - decimal: 128 bits
    - string: 16 bits por caracter, de tipo por referencia
    - char: 16 bits, de tipo utf16
    - bool: 8 bits
----

### Declarar una variable

- Debo especificar el tipo

> int edad = 28;

- Puedo declararla sin inicializar, pero no puedo usarla sin inicializar

> int edad;

- Todas las expresiones que no van seguidas de llaves terminan con punto y coma
- Operadores aritméticos, son los mismos que en cualquier lenguaje de programación: +, -, *, /, % , ++, --
- También hay interpolación de strings con $"" y la variable entre llaves

> Console.WriteLine($"Tienes la edad de {edad} años");

- El flujo de ejecución va de arriba abajo y de izquierda a derecha
- Eso quiere decir que si coloco el incremento antes de la variable me sumará 1. Si lo coloco después, en este caso no

> Console.WriteLine($"Tienes la edad de {++edad} años"); //edad = 29

- No tiene mucho sentido usarlo así. Normalmente se usa como sufijo para incrementar

> edad++

- Puedo asignar el mismo valor a diferentes variables

> int variable1 = variable2 = variable3 = variable4 = 34;

- Todas valen 34

- De esta otra forma solo asignaría a la variable4 34

> int variable1,variable2,variable3, variable4 = 34;

- Declaración implicita de variables
- El compilador le asignará el tipo de dato
- Siempre deben ser inicializadas
- No voy a poder cambiar el tipo posteriormente

> var edadPersona= 27;

> edadPersona= 27.5 //error
----

### Casteo

- Castear variables. Conversión explícita

~~~cs
double temperatura = 34.5;
int temperaturaMadrid= (int) temperatura;
~~~

- Conversión implicita. Cuando casteo una variable a un tipo compatible pero de mayor alcance

~~~cs
int habitantesCiudad= 100000;
long habitantesCiudad2020 = habitantesCiudad;
~~~

- Buscar Tabla de conversiones numéricas implícitas en google
- Cuando la dirección es contraria a la conversión implicita se usa el casting
----

### Conversión de texto a número

- Se usa int.Parse en el caso de que quiera convertir a int
- Si fuera la conversión a un double, double.Parse()
- Voy a pedir que el usuario ingrese dos valores y sumarlos
- La consola regresa un string, uso .Parse para passarlo a entero

~~~cs
Console.WriteLine("Ingresa el primer valor");

int numero1 = int.Parse(Console.ReadLine());

Console.WriteLine("Ingresa el segundo valor");

int numero2 = int.Parse(Console.ReadLine());

Console.WriteLine("El resultado es " + (numero1+numero2));
~~~

- Si le ingreso un valor no válido (76fs, por ejemplo) me salta Unhsndled Exception
    - Es un error no manejado desde el código, porque no puede pasar a int un valor con letras
-----

### Constantes

- Es un valor almacenado que no cambia nunca
- Debe iniciarse en la misma linea
- Por convención van en mahyúsculas

> const int VALOR= 3;

- Se puede usar la coma para pasar como segundo argumento de Console.Writeline y las llaves para indicarle la posición que quiero mostrar
. Los parámteros empiezan por el 0 como los arrays

> Console.WriteLine("el valor de la constante es: {0} ", VALOR)

- Las constantes de tipo entero y de tipo string se suelen englobar en una clase
- Usar las constantes para calcular el área de un círculo
    - Se necesita el radio y PI. Como PI debe de ser inalterable, se usa una constante
~~~cs

const double PI = 3.1416;

Console.WriteLine("Ingresa el radio");

double radio = double.Parse(Console.ReadLine());


double resultado = radio* radio * PI;

Console.WriteLine("El área del círculo es: {0}", resultado);
~~~

- Se puede usar la clase Math para hallar la potencia. Los parámetros deben de ser de tipo double ( lo dice la ayuda )
- Para hallar la potencia se usa Math.Pow(base, exponente)

~~~cs
double resultado = Math.Pow(radio,2) * PI
~~~
------

### Métodos

- Sirven para realizar una tarea en concreto en un momento determinado, no cuando el flujo de ejecución llegue a ese código, sino cuando sea llamado. La estructura es la siguiente: (los parámetros son opcionales)

~~~
 TipoDeVuelto nombreMetodo (parámetros){
        cuerpo del método
        }
~~~

- Se usa el return para retornar lo que queramos que retorne
- Estos métodos irán siempre dentro de una clase
- Se debe especificar siempre el tipo de vuelta del return y el de los parámetros
- Si devuelve algo está obligado a llevar un return

~~~cs
int sumaNumeros(){
    int num = 12;
    int num2= 1;

    int resultado = num + num2

    return resultado;    
}
~~~

- Para usar los parámetros debo especificar el tipo

~~~cs
static int sumaNumeros(int num, int num2){
    

    int resultado = num + num2

    return resultado;    
}
~~~

- Double + int siempre devolverá un double,
. Debo especificar un double como valor de retorno para que no marque error

~~~cs
 static double sumaNumeros(double num, int num2){
    

    int resultado = num + num2

    return resultado;    
}
~~~

- Con la palabra void como retorno significa que no devuelve nada.
- Jamás llevará un return
~~~cs
static void sumaNumeros(int num, int num2){
    

    int resultado = num + num2

    Console.WriteLine(resultado); // imprime pero no devuelve nada    
}
~~~
----

### Métodos II

- Si uso el método dentro del Main sin static da error porque necesita un objeto

~~~cs
static void mensajeEnPantalla()
{
    Console.WriteLine("Mensaje en pantalla");
}
~~~

- Si invoco el método en el main y luego pongo  un Console.WriteLine, primero ejecutará lo que haya en el método y luego el Console.WriteLine
- Cuando llega al método busca en todo el bloque y lo ejecuta
- El return automáticamente sale del método y devuelve el flujo de ejecución a la llamada. Después del return no se ejecuta nada más en el mñetodo.
- Para usar el return hay que prescindir de la palabra void
- Un método además de primitivos también puede devolver un objeto 
- Si el método es demasiado grande conviene hacer uso de modularización.
    - Dividir el código en partes más pequeñas
- Cuando el método solo devuelve una sentencia de return puedo usar la flecha

~~~cs
static int sumaNumeros(int num1, int num2) => num1 + num2
~~~
-----

### Métodos IV

- Ámbito o alcance de métodos y variables
    - Contexto, ámbito y alcance son un amisma cosa.
    - Las variables declaradas dentro de un método solo viven en ese scope
    - En cuanto el método termina su ejecución, todo lo que hay entre llaves desaparece de la memoria
    - Cuando declaro una variable dentro de la clase para poder usarla en varios métodos distintos, puedo declararla después del método
        - Las variables declaradas en el ámbito de clase pueden ser declaradas después del método en el que se utilizan 
- Sobrecarga de métodos
    - Dos idénticos no se puede, deben recibir o diferente tipos de parámetro o diferente número de parámetros
    - Encima del método dirá el número derefrencias (veces que se le ha llamado)

~~~cs
static int SumaNum(int num1, int num2)=>num1+num2;
static double SumaNum(double num1, int num2)=>num1+num2;
static int SumaNum(int num1, int num2, int num3)=>num1+num2+num3;
~~~
----

### Métodos V

- Métodos con parámetros opcionales
    - C# permite recibir parámetros opcionales 
    - Útiles para compatibilidad con tecnologías que no admitan sobrecarga
    - Se define asignándole un valor por defecto
    - Los parámetros opcionales deben ir al final
~~~cs
static int SumaNum(int num1, int num2, int num3= 0)=>num1+num2+num3;
~~~

- Ambigüedades
    - Si tengo dos métodos iguales (sobrecarga) con dos parámetros y el segundo con un tercer parámetro opcional, si pongo dos parámetros llamará al primero.
----

### Condicional If

- Si el cuerpo del if es solo de una linea se pueden omitir las llaves
    - Lo mismo con el else
- Si el valor es true, se puede omitir la comparación ==

~~~cs
bool carnet = true;
if(carnet) Console.WriteLine("Puedes conducir");
else Console.WriteLine("No puedes conducir");
~~~

- Si quiero almacenar como entero lo que introduce el usuario en consola tengo que parsearlo
~~~cs
Console.WriteLine("Introduce tu edad, por favor");
int edad = int.Parse(Console.ReadLine());
string carnet= "no";//La inicio en no por defecto porque si no cumple el primer if, en el segundo if estaría
                //usando una variable no inicializada, lo que me daría error
if(edad >=18){
    Console.WriteLine("¿Tienes carnet?");
    carnet = Console.ReadLine();
}
    
if(edad >= 18 && carnet=="si") Console.WriteLine("Puedes conducir");
else  Console.WriteLine("No puedes conducir");
~~~

- Dispongo tambien del operador || (or), el distinto a !=, la negación ! y de else if
- Una manera más elegante sería esta

~~~cs
Console.WriteLine("Introduce tu edad, por favor");
int edad = int.Parse(Console.ReadLine());

if(edad < 18) Console.WriteLine("No puedes conducir");

else{
    Console.WriteLine("¿Tienes carnet?");
    string carnet = Console.ReadLine();

    int compara = String.Compare(carnet, "si", true); // el tercer parámetro true es para que ignore Case sensitive

    if(compara == 0) Console.WriteLine("Puedes conducir");
    else Console.WriteLine("No puedes conducir"); 
}
~~~
------

### Switch

- sintaxis
    - El default es opcional, como un else 
~~~cs
Switch(expresion_de_control){

    case constante:
        //código
        break;
    case constante:
    //código
    break;

    default:
    //código
    break;    
}
~~~
- Cada constante que determina el case debe de ser única
- Los case solo pueden contener expresiones constantes
- Todos los case deben llevar su break
    - Se puede usar el return o un throw en lugar del break
- Solo se puede usar el switch paraevaluar
    - int
    - char
    - string
- Float y Double han de utilizar un if
~~~cs
Console.WriteLine("Introduce el medio de transporte(coche, tren, avion)");

string medioTransporte = Console.ReadLine();

switch(medioTransporte){
    case "coche":
    Console.WriteLine("Velocidad media 100 km/h");
    break;

    case "tren":
    Console.WriteLine("Velocidad media 250 km/h");
    break;

    case "avion":
    Console.WriteLine("Velocidad media 100 km/h");
    break;

    default:
    Console.WriteLine("Transporte no contemplado");
    break;
}
~~~
- Se suele usar en casos dónde hay muchas condiciones
-----

## WHILE

- Dos tipos de bucles: determinados e indeterminados
    - Determinados: for, for in
    - Indeterminados: No se sabe cuantas veces se va a repetir su código interno, por ejemplo consultando una DB. while, do-while
    - Para consultar una db se usará while

~~~cs
while(condicion_a_evaluar){
    codigo
}
~~~

- En algún momento del código tendrá que cambiar la condicion_a_evaluar para que salga del bucle
------

### DO-WHILE

~~~cs
Random numeroRandom = new Random();

int aleatorio = numeroRandom.Next(0,100);

int miNumero;

int intentos = 0;

Console.WriteLine("Introduce un numero del 0 al 100");

do{
intentos ++;
miNumero = int.Parse(Console.ReadLine());

if(miNumero >= aleatorio) Console.WriteLine($"El número es menor que {miNumero} ");
if(miNumero <= aleatorio) Console.WriteLine($"El número es mayor que {miNumero} ");

}while(miNumero != aleatorio);

Console.WriteLine($"Has acertado! El numero era {aleatorio}! Lo has intentado {intentos} veces");
~~~
---

## EXCEPCIONES I

- Excepción es un error en tiempo de ejecución que escapan al control del programador
    - Memoria corrupta
    - Desbordamiento de pila
    - Sectores de disco duro defectuosos
    - Acceso a ficheros inexistentes
    - Conexiones a DB's interrumpidas
    - etc.
- Para capturar el error y manejar la excepción se usará try catch
- En el código anterior, si el usuario en lugar de un numero introduce texto, aparecerá una excepción de formato porque Parse no puede pasar a int un numero
- Debo iniciar en el catch miNumero en 0 para que si cae en el catch no de el error de variable no inicializada al no pasar por el try 
~~~cs

Random numeroRandom = new Random();

int aleatorio = numeroRandom.Next(0,100);

int miNumero;

int intentos = 0;

Console.WriteLine("Introduce un numero del 0 al 100");

do{
intentos ++;

try{
    miNumero = int.Parse(Console.ReadLine());

}catch(FormatException ex){  //Un objeto tipo FormatException llamado ex de exception
    Console.WriteLine("No has introducido un número válido. Se inicia el número en 0");
    miNumero=0;
};

if(miNumero >= aleatorio) Console.WriteLine($"El número es menor que {miNumero} ");
if(miNumero <= aleatorio) Console.WriteLine($"El número es mayor que {miNumero} ");

}while(miNumero != aleatorio);

Console.WriteLine($"Has acertado! El numero era {aleatorio}! Lo has intentado {intentos} veces");
~~~
- Una misma linea de código puede manejar varias excepciones en varios catch

    NOTA: Hay que prestar atención a las variables y su ámbito, y si han sido inicializadas o no, ya que no pueden usarse si no se han inicializado
-----

## EXCEPCIONES II

- Capturar varias excepciones
- Si en el programa de adivinar numero introduzco 97463872462837462387462 me lanza una excepcion de Overflow 
- Puedo manejarla así
~~~cs
try{
    miNumero = int.Parse(Console.ReadLine());

}catch(FormatException ex){  //Un objeto tipo FormatException llamado ex de exception
    Console.WriteLine("No has introducido un número válido. Se inicia el número en 0");
    miNumero=0;
}catch(OverflowException ex){
    Console.WriteLine("El numero es demasiado largo. Se inicia el número en 0");
    miNumero=0;
};
~~~
- Podría lanzar un montón de excepciones, por ello se usan excepciones genéricas
    - Por encima de Format y Overflow tenemos SystemException, y por encima de System tenemos Exception
    - Podría poner solo el último catch para atrapar cualquier excepción
    - Si introduzco una exception puedo poner solo catch, pero es considerado una mala práctica

~~~cs
catch(FormatException ex){  //Un objeto tipo FormatException llamado ex de exception. Puedo usar el nombre de variable que quiera, e de error
    Console.WriteLine("No has introducido un número válido. Se inicia el número en 0");
    miNumero=0;
}catch(OverflowException ex){
    Console.WriteLine("El numero es demasiado largo. Se inicia el número en 0");
    miNumero=0;
}catch(Exception e){
    Console.WriteLine(e.Message);
    miNumero= 0;
};
~~~
----

## EXCEPCIONES III

- Conflictos en el uso de varios catch
    - Para que no capture el error en el catch de excepción general, coloco el otro catch con la excepción concreta antes
    - Primero los catch especificos y luego los genéricos
- Captura de excepciones con filtro
    - El objeto error de tipo Exception tiene sus métodos
    - Le digo que capture todas las excepciones excepto FormatException
    - No capturará el FormatException, puedo captar el error con otro catch posterior
~~~cs
catch (Exception e) when (e.getType() != typeof(Formatexception))
~~~
    - 
- Expresiones checked y unchecked 
    - Si guardo el valor máximo de int en una variable y le sumo 20 debería haber un desbordamiento
    - Sin embargo me devuelve una respuesta errónea, transformando el número a negativo
~~~cs

int numero = int.MaxValue;

int resultado = numero + 20;

Console.WriteLine(resultado); // Me devuelve una respuesta erronea en lugar de la excepción
~~~
- La explicación de este error es el rendimiento. El compilador sabe que hay un desbordamiento pero antes de dejar caer el programa devuelve una respuesta erronea
- Es lo que hace con las operaciones aritméticas. Pero este comportamiento puede no ir bien
- Para ello uso checked{}. Solo funciona con int y long
    - Lo que haya dentro será comprobado y si hay un error detendrá el programa
~~~cs
checked{
    int numero = int.MaxValue;

    int resultado = numero + 20;

    Console.WriteLine(resultado); // Me devuelve una respuesta erronea en lugar de la excepción
}
~~~
- Se puede usar el checked de forma abreviada

~~~cs
 int resultado = checked(numero + 20);
~~~

- En propiedades del proyecto/Compilación/Avanzadas/Comprobar el desbordamiento y subdesbordamiento aritmético para que lo haga automaticamente
- Puedo usar el unchecked para omitir la comprobación

## EXCEPCIONES IV

- Lanzamiento de excepciones con throw
- más info en .net framework library
    - En la página web encuentro en System ArgumentOutOfRangeException, que viene a ser la excepción que necesito para un numero equivocado de mes

~~~cs
static string nombreDelMes (int mes)
 {
    switch(mes){
        case 1:
        return "Enero";
        break;

        case 2:
        return "Febrero";
        break;

        default:
        throw new ArgumentOutOfRangeException() ;
        break;
}
~~~

- Para que el programa no caiga y cómo el método puede lanzar una excepción lo meto en un try catch
- Se pueden crear excepciones propias
-----

## EXCEPCIONES V

- Uso finally
- Puedo usar el finally para que ejecute algo tanto si el try catch tiene éxito como si no

~~~cs
try{

}catch{

}finally{
    Console.WriteLine("Esto se imprime si o si")
}
~~~

- Casos de uso más comunes
    - Con DB's
        - Siempre se usa en caso de necesidad de liberar recursos
        - Con una DB, en el caso de la conexión, para asegurarse de que se cierra y no consume recursos
    - Con lectura de ficheros externos
        - Se abre una conexión con el sistema de archivos. Se suele usar un finally para cerrar la conexión
- Para leer un archivo:
    - Abro una ruta con StreamReader para acceder al archivo
    - Creo un contador para las lineas del archivo
    - Mientras las lineas del archivo sean distintas de null, contador++
    - Coloco en el finally el cierre de la conexión
~~~cs
System.IO.StreamReader archivo = null;

try{
    string linea;
    int contador = 0;

    string path= @"path_del_archivo";

    archivo = new System.IO.StreamReader(path);

    while((linea=archivo.ReadLine()) != null)
    {
        Console.WriteLine(linea);
        contador++;

    }

}catch(Exception e){
    Console.WriteLine("Error: "+ e.Message);

}finally{

    if(archivo != null) archivo.Close();
    Console.WriteLine("Conexión con el fichero cerrada");
}
~~~
-----------


