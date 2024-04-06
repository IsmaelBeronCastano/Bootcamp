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

//console.log(venta.calculate(100));    //110

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

//console.log(venta.calculate(100)); //107



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

//console.log(venta.calculate(10)); //200

