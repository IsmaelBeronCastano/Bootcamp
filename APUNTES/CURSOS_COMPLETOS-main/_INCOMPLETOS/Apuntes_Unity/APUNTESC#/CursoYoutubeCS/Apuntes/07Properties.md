# PROPERTIES EN C#

- Qué son y cual es su utilidad
- Tengo la clase Empleado con un getter y un setter

~~~cs
Empleado Jaime = new Empleado("Jaime");

class Empleado
{
    public Empleado(string nombre;)
    {
        this.nombre= nombre;
    }



    public void setSalario(double salario){

        if(salario < 0)
        {
            Console.WriteLine("El salario no puede ser negativo. Se le asignará 0 como salario.")
            this.salario = 0;
        }
        else{
            this.salario = salario;
        }
    }

    public doube getSalario()
    {
        return salario;
    }

   private double salario;
   private string nombre;
}
~~~

- El tema de las properties tiene mucho que ver con la encapsulación
- Si la propiedad salario no estuviera encapsulada podría hacer cosas como esta
    - Si quisiera incrementar en 700 el sueldo de Jaime

~~~cs
Jaime.setSalario(1200);

//double nuevoSalario = Jaime.getSalario()+700; //con encapsulación

//Console.WriteLine(nuevoSalario);

Jaime.salario += 700; //podría hacer esto si salario no estuviera encapsulado ROMPE LA REGLA DE ENCAPSULACIÓN DE LA POO
~~~

- De esta manera (sin encapsular salario con private) podemos generar un mal comportamiento del programa y que los métodos no funcionen como deben
- Las properties reune lo mejor de la encapsulación pero me va a permitir una sintaxis más sencilla
- No necesito el getter y setter
- En la clase Empleado creo un método de control encapsulado para evaluar el salario que le hemos dado a un empleado
- Para crear la propiedad uso public el tipo y el nombre en mayúsculas
    - Abro llaves, y dentro creo el getter y el setter.
    - Uso la palabra reservada value para el parámetro del método de control evaluarSalario
~~~cs

//método de control
private double evaluarSalario(double salario)
{
    if(salario < 0 )
    {
        Console.WriteLine("El salario no puede ser negativo. Se le asignará 0 como salario");
    }
    else return salario;

    //Creación de la propiedad. por convención en mayúsculas

    public double SALARIO
    {
        get {return this.salario;}
        set { this.salario= evaluaSalario( value );}
    }
}
~~~

- Para que esto trabaje, una vez he creado la instancia:

~~~cs
//Main()

Empleado Jaime = new Empleado("Jaime");

Jaime.SALARIO = 1200;
Jaime.SALARIO += 300;

Console.WriteLine("El sueldo del empleado es"+ Jaime.SALARIO);
~~~

- De esta manera uso una sintaxis más sencilla para la encapsulación. Útil en determinados escenarios
- Otras veces es más complicado crear propiedades que la encapsulación
-------

## PROPIEDADEs II

- Expresión bodied en propiedades
- Propiedad de solo lectura o de solo escritura
- Convenciones en el uso de propiedades
- Se puede simplificar la sintaxis de la propiedad anterior SALARIO
    - El nombre de la propertie suel ser el mismo que el del campo encapsulado pero con mayúsculas
    - Uso las palabras reservadas get y set y la flecha (lambda)
    - Cuando vas a usar propiedades se suelen nombrar los campos con un guión bajo delante

~~~cs
public double SALARIO
{
    get =>this._salario;
    set =>this._salario = evaluaSalario(value)
}

private double _salario; // es una forma de diferenciar de forma clara el nombre de la property y el campo, pero es pura convención
private string _nombre;
~~~

- Puedes crear properties solo de escritura o solo lectura
    - Para crear una property de solo escritura puedes prescindir del get
    - A la inversa para solo lectura (solo con el get)
----

- 