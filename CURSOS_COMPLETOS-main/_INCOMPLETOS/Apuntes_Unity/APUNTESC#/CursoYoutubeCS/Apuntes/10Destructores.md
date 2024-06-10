# DESTRUCTORES C#

- Recolector de basura (Garbage Collection)
- Mirar aquellos objetos que ya no se van a utilizar, una referencia o un puntero que quedan fuera del alcance, y eliminarlos
- En C# el Garbage Collection es automático
- Un destructor ejecuta código a la destrucción de un recurso en memoria
- Ejemplos:
    - Conexiones con DB's. Cuando una conexión a una DB ya no es necesaria podemos cerrarla dentro del destructor
    - Cierre de streams en el manejo de ficheros
    - Eliminación de objetos de colecciones, etc.

~~~cs
using System.IO;

//leer info de un fichero de texto

class ManejoArchivos
{   
    //Creo un objeto de tipo StreamReader de la biblioteca System.IO
    StreamReader archivo = null;

    int contador = 0;
    string linea;

    public ManejoArchivos()
    {
        archivo = new StreamReader(@"path/del/archivo.txt"); //Aquí se ha abierto un flujo de datos

        while((linea=archivo.ReadLine())!= null) //mientras haya texto
        {
            Console.WriteLine(linea);

            contador++;
        }
    }

    public void mensaje()
    {
        Console.WriteLine("Hay {0} lineas", contador);
    }

    //Para el destructor uso la tilde con el nombre de la clase
    //Aqui va el código que quiero que se ejecute cuando el Garbage Collector está eliminando ese recdurso 

    ~ManejarArchivos()
    {
        archivo.Close();
    } 

    //Main()

    ManejoArchivos miArchivo = new ManejoArchivos(); //devuelve el texto en el archivo
    miArchivo.mensaje();   //devuelve el numero de lineas
}
~~~
- Los destructores solo se usan en clases
- Cada clase solo puede tener un destructor
- Los destructores no se heredan ni se sobrecargan
- Los destructores no se llaman. Son invocados automáticamente
- No tienen ni modificadores de acceso ni parámetros
- Es mejor en la medida de lo posible no usarlo y dejar actuar al Garbage Collector
