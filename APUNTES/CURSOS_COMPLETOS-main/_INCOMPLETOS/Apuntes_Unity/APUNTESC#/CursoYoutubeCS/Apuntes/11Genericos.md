# GENERICOS EN C#

- Favorece la reutilización de código
- Programar genéricos se puede substituir por construir herencia
- Programación genérica consiste en crear clases comodín
- Puedo crear una clase que sea capaz de manejar objetos de tipo string, double, lo que sea
- Sintaxis

~~~cs
//En un objeto de tipo EjemploClase voy a manejar datos de tipo String
EjemploClase <String> archivos = new EjemploClase<String>();

    //<String> es un parámetro de tipo

EjemploClase <File> archivos1 = new EjemploClase<File>();
~~~

- Podemos hacer lom ismo sin programación genérica? SI, con herencia
- Todas las clases heredan de la clase Object, que manejada adecuadamente nos serviría también
- Utilizar la herencia para este caso tiene sus inconvenientes
    - Uso continuo del casting
    - Complicación del código
    - No posibilidad de comprobación de errores
- La programación genérica solventa estas dificultades
    - Mayor sencillez de código
    - Reutilización delk código en numerosos escenarios
    - Comprobación de errores en tiempo de compliación
- Ejemplo de herencia usando la clase Object (...)

## GENERICOS II

- Creación de clase genérica. Uso
- Por convención para determinar que es una clase genérica uso <T>

~~~cs
class AlmacenObjetos<T>
{
    public AlmacenObjetos(int z)
    {
        datosElemento = new T[z];
    }

    public void agregar(T obj)
    {
        datosElemento[i] = obj;
        i++;
    }

    public T getElemento(int i)
    {
        return datosElemento[i];
    }

    private T[] datosElemento;
    private int i = 0; // con este contador a medida que agregue un elemento se agregará en la siguiente posición
}

class Empleado
{

    public Empleado (double salario)
    {
        this.salario = salario;
    }

    private double salario;
}
~~~

- Ahora AlmacenObjetos puede manejar cualquier tipo de dato
- Uso

~~~cs
AlmacenObjetos<Empleados> archivos = new AlmacenObjetos<Empleados>(4);

archivos.agregar(new Empleado(1500));
archivos.agregar(new Empleado(2500));
archivos.agregar(new Empleado(3500));

Empleado salarioEmpleado = archivos.getElemento(2);

Console.WriteLine(salarioEmpleado.getSalario();) //3500
~~~

- Si quiero manejar otro tipo de dato solo tengo que cambiar el tipo entre llaves angulares

~~~cs
AlmacenObjetos<String> archivos = new AlmacenObjetos<String>(4);

archivos.agregar("Juan");
~~~
----

## GENERICOS III

- Clases genéricas con restricciones
- Las restricciones surgen para solventar el que la clase pueda manejar todo tipo de objetos.
- Puedo "filtrar" por aquellos que tengan una caracteristica concreta
- Ejemplo
    - Todos deben de tener un salario, eso lo podemos implementar con una interfaz

~~~cs
class Director: IParaEmpleados
{
    public Director(double salario)
    {
        this.salario = salario;
    }

    public double getSalario()
    {
        return salario;
    }

    private double salario;
}

class Secretaria: IParaEmpleados
{
     public Secretaria(double salario)
    {
        this.salario = salario;
    }

     public double getSalario()
    {
        return salario;
    }

    private double salario;

}

class Electricista: IParaEmpleados
{
     public Electricista(double salario)
    {
        this.salario = salario;
    }

     public double getSalario()
    {
        return salario;
    }

    private double salario;
}

interface IParaempleados
{
    double getSalario();
}

//CLASE GENERICA QUE SOLO VA A MANEJAR EMPLEADOS QUE TENGAN SALARIO

class AlmacenEmpleados <T> where T: IParaEMpleados  //Esta clase solo será capaz de manejar objetos de diferente tipo que implementen esta interfaz
{
    public Almacenempleados(int z)
    {
        datosEmpleado = new T[z];
    }

    public void agregar(T obj)
    {
        datosEmpleado[i]= obj;
        i++;
    }

    public T getEmpleado(int i)
    {
        return datosEmpleado[i];
    }

    private int i = 0;
    private T[] datosEmpleado;
}

//MAin

AlmacenEmpleados<Director> empleados = new AlmacenEmpleados<Director>(3);

empleados.agregar(new Director(3500));
empleados.agregar(new Director(2500));
empleados.agregar(new Director(4500));


~~~

