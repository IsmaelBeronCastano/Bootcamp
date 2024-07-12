
      
using System;

        static void realizarTarea()
        {
            Punto origen= new Punto();
            Punto destino = new Punto(150,90);
            
            double distancia = origen.distanciaHasta(destino); //origen tiene x, y = 0 por el constructor sin parámetros
                                //en el método se observa que hacer referencia a this.x (=0) - destino.x (=150)
            Console.WriteLine(distancia);   

        }

        //realizarTarea();
        double raiz = Math.Sqrt(9);
        double potencia = Math.Pow(3,4);

        realizarTarea();
        
Empleados[] arrayEmpleados= new Empleados[2];

var personas = new[]
{
    new {Nombre="Juan", edad=39},  //posición 0 del array
    new {Nombre= "Pepita", edad=32},
    new {Nombre="Diana", edad=23}  //el último no lleva coma
};

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

