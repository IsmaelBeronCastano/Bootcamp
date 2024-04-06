# PATRON

- Los patrones de diseño pueden ser creacionales, estructurales o de comportamiento
- Este patrón facilita tener diferentes comportamientos de un objeto sin tener que modificar el contexto inicial
- Si necesitamos otra estrategia agregamos una nueva clase
- El contexto es el objeto central que va a unificar las cosas, va a ser el objeto
- Los demás van a ser la funcionalidad
- Es de los patrones más utilizados
----------

- La clase contexto se caracteriza por tener una estrategia y una acción
- Calculos en venta

~~~js
//CONTEXTO

class SaleContext{

    constructor(strategy){
        this.strategy = strategy;
    }

    calculate(amount){
            return this.strategy.calculate(amount); //nuestra estrategia debería tener un método calculate
    }
}
~~~

- Creo las estrategias con clases

~~~js
//Estrategia

class RegularSaleStrategy{

    constructor(tax){
        this.tax = tax; // la clase se construye con un impuesto
    }


    calculate(amount){
        return amount + (amount*this.tax); // el método calculate que necesito para el contexto
    }
}

let impuesto = 0.10;
const Strategy_impuesto = new RegularSaleStrategy(impuesto);
const Ventas_impuesto = new SaleContext(Strategy_impuesto);

console.log(Ventas_impuesto.calculate(100));
~~~

- Si quiero otro comportamiento creo otra clase
~~~js
//Estrategia 2

class DiscountSaleStrategy{

    constructor(tax, discount){
        this.tax = tax;
        this.discount= discount;
    }

    calculate(amount){
        return amount + (amount*this.tax) -  this.discount;
    }

}
~~~

- Para no tener que andar creando nuevas instancias puedo crearle un set al contexto

~~~js
class SaleContext{

    constructor(strategy){
        this.strategy = strategy;
    }

    setStrategy(strategy){
        this.strategy = strategy;
    }

    calculate(amount){
            return this.strategy.calculate(amount); //nuestra estrategia debería tener un método calculate
    }
}
~~~

- Ahora puedo cambiarle la estrategia al objeto
- No es obligatorio que las estrategias tengan constructores, puedes no necesitar parámetros
    - Es el caso de ForeignSale, que da el cambio al dolar
~~~js
//Contexto

class SaleContext{

    constructor(strategy){
        this.strategy = strategy;
    }

    setStrategy(strategy){
        this.strategy = strategy;
    }

    calculate(amount){
            return this.strategy.calculate(amount); //nuestra estrategia debería tener un método calculate
    }
}


//Estrategias

class RegularSaleStrategy{

    constructor(tax){
        this.tax = tax; // la clase se construye con un impuesto
    }


    calculate(amount){
        return amount + (amount * this.tax); // el método calculate que necesito para el contexto
    }
}

let impuesto = 0.10;
const Strategy_impuesto = new RegularSaleStrategy(impuesto);
const venta = new SaleContext(Strategy_impuesto);

console.log(venta.calculate(100));    //110

class DiscountSaleStrategy{

    constructor(tax, discount){
        this.tax = tax;
        this.discount= discount;
    }

    calculate(amount){
        return amount + (amount*this.tax) -  this.discount;
    }

}

const discount = 3; //descuento de 3 dólares

venta.setStrategy(new DiscountSaleStrategy(impuesto, discount));

console.log(venta.calculate(100)); //107



class ForeignSaleStrategy{

    getDollarPrice()
    {
        return 20;
    }

    calculate(amount){
        return amount * this.getDollarPrice();
    }
}

const foreignSale = new ForeignSaleStrategy();

venta.setStrategy(foreignSale);

console.log(venta.calculate(10)); //200
~~~

- Se puede escalar la funcionalidad gracias al patrón Strategy
----------

# STRATEGY CASO PRACTICO

- El patrón estrategia sirve cuando tengamos comportamientos que van a cambiar en un objeto en tiempo de ejecución
- Este patrón se suele detectar cuando tenemos un switch largo o muchos if determinando comportamiento
- Ejemplo: Tenemos un array el cual tenemos que representar según la elección del usuario

~~~ts
const data = [
    {
        name: "Schoerdinguer",
        country: "Alemania",
        info: "Es una cerveza de la Alemania más tocha",
        url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FCerveza&psig=AOvVaw2dzHY9C5t-f8sg0A3rmMVm&ust=1679600642085000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPjw7Yqm8P0CFQAAAAAdAAAAABAO"
    },
    {
        name: "Birrilla",
        country: "Barcelona",
        info: "Una birria del barrio",
        url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fes%2Fimages%2Fsearch%2Fcerveza%2F&psig=AOvVaw2dzHY9C5t-f8sg0A3rmMVm&ust=1679600642085000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPjw7Yqm8P0CFQAAAAAdAAAAABAW"
    },
    {
        name: "Voll Damm",
        country: "Catalunya",
        info: "Una birra amb còs",
        url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvivonium.es%2Fwp-content%2Fuploads%2F2021%2F02%2FVoll-Damm-33-Cl-Mediana_Tercio.webp&tbnid=NH29_9GxofL4wM&vet=12ahUKEwih99vhpvD9AhUip0wKHb7iAJ4QMygDegUIARC7AQ..i&imgrefurl=https%3A%2F%2Fvivonium.es%2Ftienda%2Fvoll-damm-retornable-33cl-caja-24-unid%2F&docid=cr91GsFBSmONhM&w=500&h=500&q=voll%20damm&client=firefox-b-d&ved=2ahUKEwih99vhpvD9AhUip0wKHb7iAJ4QMygDegUIARC7AQ"
    }
]
~~~

- Creo un div en el html con la clase content

~~~js
const App =()=> {
 

  return (
    <>
      <p>Hello World</p>
      <div className="content">

      </div>
    
    
    </>
  )
}

export default App
~~~

3:12 Practica Strategy