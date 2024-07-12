# Singleton

- Un SINGLETON no es cap disc senzill ni una app de cites
- Si vols descobrir-ho, quedat!!
- Un Singleton em serveix per assegurar-me de que només hi hagi una instància de la meva classe
- Això pot ser molt útil en varies situacions, com per exemple un servidor de websockets
- Creo la classe Singleton (no te perquè dir-se així)
- Declaro la propietat privada i estàtica de tipus Singleton.
- Privada perquè només s'utilitzi dins la classe i 
- 
- El constructor será privat, defineixo una interfaç per les opcions que li passi.
- Utilitzo la desestructuració per extreure el nom i cognom de les opcions i els hi assigno un valor per defecte
- Faig un mètode get estàtic per no haver d'instanciar la classe per poder fer-lo servir
- Utilitzo el condicional if per evaluar si ja existeix una instància del Singleton
- El signe d'admiració al principi em serveix de negació
- Si no existeix llenço un string a consola
- Si existeix el retorno
- Faig el mètode estàtic initSingleton passant-li les opcions com a paràmetre
- Guardo dins la propietat instance la instància de la classe Singleton 
- I ja ho tens! recorda: fot-li al codi, a la ment i al body. Maik Zen



~~~js
interface Options {
 nom: string
 cognom: string
}


export class Singleton {

  private static _instance: Singleton;
  

  private constructor( options: Options ) {
    const { nom="Jofre", cognom="Massagué"} = options; 
  }


 
  static get instance(): Singleton {
    if ( !Singleton._instance ) {
      throw 'Singleton is not initialized'; 
    }

    return Singleton._instance; 
  }
 
  static initSingleton( options: Options ) {
    Singleton._instance = new Singleton(options);
  }

  }
~~~