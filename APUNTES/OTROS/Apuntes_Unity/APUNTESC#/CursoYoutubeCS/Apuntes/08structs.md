# STRUCTS EN C#
- Que son? Clases Vs Structs
- Cuando utilizar las structs
- Las clases se almacenan en la memoria HEAP y las structs en lamemoria STACK
- Una variable es un espacio en la memoria que tiene un valor que puede cambiar ( si es una constante no cambia)
- Hay 2 tipos de memoria: HEAP y STACK
    - Un primitivo se almacenará en la STACK
    - Cuando creo una referencia a la clase con el constructor new se reserva un espacio en la memoria HEAP de ese Objeto Empleado
    - Y es cuando el compilador lee ese objeto que se crea un espacio en la memoria STACK que apunta/linkeado a ese espacio en el HEAP al que hace referencia el objeto

~~~cs
Empleado Carlos = new Empleado("Carlos"); //new crea un espacio en la memoria HEAP que hace referencia al objeto Empleado
                                          //Carlos es almacenado en la memoria Stack. Carlos esta asociado al espacio en memoria HEAP que hace referencia a Empleado
~~~

- Cuando creo otra instancia de Empleado, **OTRO ESPACIO EN MEMORIA HEAP DE OBJETO EMPLEADO ES CREADO, Y EN LA MEMORIA STACK SE ALMACENA UNA REFERENCIA**
- Carlos apunta a su objeto específico para él Empleado en la memoria HEAP
- La referencia a ese objeto se crea en el STACK
- Cuando se habla de referencia, es que hace referencia a ese espacio en memoria HEAP
- **Las structs se almacenan en el STACK**
- Para crear una struct debo cambiar la palabra class por struct
- Cada vez que haga una nueva instancia de una struct con new se crea una copia independiente en el STACK
- Esto no ocurre con las clases, donde cuando yo haga un cambio desde la instancia alterará la clase original

~~~cs
Empleado empleado1 = new Empleado(1200,500);
Console.WriteLine(empleado1)


public struct Empleado
{
    public double salarioBase, comision;

    public Empleado(int salarioBase, int comision)
    {
        this.salarioBase = salarioBase;
        this.comision = comision;
    }
    
    public override string ToString() //Sobreescribo el método ToString
    {
        return string.Format("Salario y comision del empleado ({0},{1})", this.salarioBase, this.comision); 
    }

}
~~~

- Internamente, ahora empleado1 es una copia independiente de la estructura Empleado
    - Lo que sea que yo modifique se modificará solo en empleado1 sin alterar Empleado
- Puedo crear un método para incrementar el salario

~~~cs
//dentro de la struct Empleado
public void incrementoSalario(Empleado emp, int incremento)
{
    emp.salarioBase += incremento;
    emp.comision += incremento;
}
~~~

- Para llamarlo

~~~cs
//MAIN

empleado1.incrementoSalario(empleado1, 100);
~~~
- De esta manera no afecta a la estructura Empleado, solo a empleado1. Todo se almacena en el stack, los cambios son a la copia. 
- La memoria STACK es de acceso rápido, la HEAP es más lenta.
- La memoria STACK es más volátil, el valor de las variables una vez finaliza la ejecución del método se pierden, mientras que la info como variables globales, objetos en la HEAP siguen disponibles en toda la ejecución del programa
- STACK es de tipo LIFO(Last In First Out), de tipo pila, se va apilando
- **DIFERENCIAS DE STRUCT CON LAS CLASES**
    - Las struct no admiten constructor por defecto
    - El compilador no inicia los campos. Puedes iniciarlos en el constructor
    - No puede haber sobrecarga de constructores
    - No heredan de otras clases pero si implementan interfaces
    - Son selladas, sealed
- Muy usadas con una cantidad muy alta de datos en memoria, muchos numeros primitivos, con arrays con mucha indformacion, puntos 3D
- Cuando las instancias no deban cambiar nunca
- Cuando no necesite tener un tamaño superior a 16 bytes
- Cuando no necesite convertir nada a objeto (boxed)
- Por raszones de rendimiento
----


