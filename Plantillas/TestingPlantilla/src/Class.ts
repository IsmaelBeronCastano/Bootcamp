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

