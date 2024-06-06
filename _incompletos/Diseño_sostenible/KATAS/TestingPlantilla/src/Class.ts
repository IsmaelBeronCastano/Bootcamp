interface IGat{
    nom: string
    edat: number
    data_naixement: string
    raça: string
    menjar_preferit: menjar_preferit
}

enum menjar_preferit {
    animal_maritim= "animal_maritim",
    vegetal = "vegetal",
    animal_terrestre= "animal_terrestre",
    au = "au"
}

const Cueta: IGat = {
    nom: "Cueta",
    edat: 3,
    data_naixement: "01-03-2020",
    raça: "europea",
    menjar_preferit: menjar_preferit.au
}

class Gat implements IGat {

   public nom = ""

   public  edat = 1

   public data_naixement = ""

   public  raça = ""

   public  menjar_preferit = menjar_preferit.animal_maritim


    constructor(gat: IGat){
        this.nom = gat.nom
        this.edat = gat.edat
        this.data_naixement = gat.data_naixement
        this.raça = gat.raça
        this.menjar_preferit = gat.menjar_preferit
    }

}










interface Client{
    nom: string
    IBAN: number   
}

interface IPagament {
    obtenirDadesClient: ()=> Client
    carrec: ()=> number
}

class PagamentEuros{
    obtenirDadesClientEuros(){
        return ({
            nom: "Joan",
            IBAN: 123456789
        })
    }
    carrecClientEuros(){
        return 1234
    }
}

class PagamentDolars{
        obtenirDadesClientDolars(){
            return ({
                nom: "Ana",
                IBAN: 123456789
            })
        }
        carrecClientDolars(){
            return 1234
        }
}

class AdaptadorEuros implements IPagament{
    pagament: PagamentEuros

    constructor(pagament:PagamentEuros){
        this.pagament = pagament
    }

    obtenirDadesClient(){
        return this.pagament.obtenirDadesClientEuros()
    }
    carrec(){
        return this.pagament.carrecClientEuros()
    }
}

class AdaptadorDolars implements IPagament{
    pagament: PagamentDolars

    constructor(pagament: PagamentDolars){
        this.pagament = pagament
    }

    obtenirDadesClient(){
        return this.pagament.obtenirDadesClientDolars()
    }
    carrec(){
        return this.pagament.carrecClientDolars()
    }

}

class Botiga{
     private pagamentAPI: IPagament

    constructor(pagament: IPagament){
            this.pagamentAPI = pagament
    }

    process(){
        this.pagamentAPI.obtenirDadesClient()
        this.pagamentAPI.carrec()
    }
}

const pagamentEuros = new PagamentEuros()
const adaptadorEuros = new AdaptadorEuros(pagamentEuros)
const botigaEuros = new Botiga(adaptadorEuros) 

const botigaEuros2 = new Botiga(new AdaptadorEuros(new PagamentEuros()))

