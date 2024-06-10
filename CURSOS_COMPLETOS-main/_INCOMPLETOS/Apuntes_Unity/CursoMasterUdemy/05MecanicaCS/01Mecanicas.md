# MECANICAS UNITY I

- Cuando se abre el script de C# en Unity tenemos los métodos Start y Update que heredan de MonoBehaviour, una de las clases principales 
    - Usada con la directriz UnityEngine
- Para la **AYUDA** Help/ScriptingReference/UnityEngine/classes/MonoBehaviour
- Para la función Start aparece este ejemplo

~~~cs
using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour
{
    private GameObject target; //creo una variable de tipo GameObject

    void Start()
    {
        target = GameObject.FindWithTag("Player1"); //La función Start se ejecuta antes del primer frame
    }
}
~~~
----

## Eventos de Unity

- Messages
- Antes del Start está el Awake
    - Ocurre cuando apenas se levanta el GameObject va encendiendo una y otra vez los componentes
    - Cuando están inicializados todos los GameObject, el siguiente paso es empezar a vivir en el siguiente frame del juego.
    - Es ahí cuando se llama al start
- Están OnDisable y OnEnable, que controlan cuando el GameObject está activo o inactivo
- Tengo un Cubo 3D, le añado el script arrastrandolo al inspector
- Si le doy al play en la consola me aparece el mensaje del Awake y OnEnable
- Si voy a la pantalla de Game y pongo el ratón encima, lo saco, lo selecciono, aparecen los mensajes en consola

~~~cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MessagesUnity : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("HOLA AWAKE");
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void OnDisable()  //cada vez que apague el GameObject va a mandar un mensaje, en este caso la consola
                              //le puedo mandar este mensaje a otro script o a otro GameObject o componente para que se desactive, por ejemplo
    {
        Debug.Log("On Disable");
    }

    void OnEnable()
    {
        Debug.Log("On Enable");
    }

    //para capturar eventos del ratón
    //estos eventos les envía mensajes a todos los script a través de los Collider o GUIElement
    //Si no tengo un collider que le mande el mensaje no lo va a recibir

    void OnMouseDown() //cada vez que clico en el collider
    {
        Debug.Log("On Mouse Down");
    }

    void OnMouseEnter() //cada vez que entro
    {
        Debug.Log("On Mouse Enter");
    }

    void OnMouseExit() //cuenta cuando salgo
    {
        Debug.Log("On Mouse Exit");
    }

    void OnMouseOver() //cuenta todo el tiempo que estoy dentro
    {
        Debug.Log("On Mouse Over");
    }

}
~~~
----

# CLASE GAMEOBJECT

- Las mecanicas principales van a ser sobre GameObject
- Creo el script Mecanica1 y lo adjunto a un GameObject, un cubo por ejemplo
- Yo puedo seleccionar un elemento GabeObject desde el código
    - Si estoy en el script que está vinculado como componente al GameObject no hace falta que cree una variable para ese GameObject
    - Puedo acceder a él con gameObject. GameObject con mayúscula hace referencia a la clase. Con minúscula al objeto al que está vinculado el script
    - gameObject. y accedo a un montón de propiedaeds
    - puedo usar this. en lugar de gameObject

~~~cs
//START()
Debug.Log(gameObject.name); //para que aparezca en consola la propiedad nombre del GameObject dónde está el script
~~~

- Yo puedo crear una variable para traerme otro GameObject de fuera
- Al poner una variable public en el script me aparece en el inspector
- Me aparece vacía
- Puedo arrastrar la MainCam como componente del GameObject cubo arrastrandolo al campo de la variable en el inspector
- GO es la abreviatura de GameObject

~~~cs
public GameObject miCamaraGO;//cuando pongo la palabra public me aparece en el script del inspector;

Debug.Log(miCamaraGO.name);//puedo referenciar a la MainCam que hay asignada en el campo de la variable miCamara en el componente script del inspector
~~~

- Puedo buscar el GameObject desde la escena, y quedarme con alguna info que me interese para trabajar con ella
- GO es la abreviatura de GameObject
- Cuando le doy play hace la búsqueda

~~~cs
public GameObject buscoGO;

//START()
buscoGO= GameObject.Find(cubo1); //le paso el nombre del GameObject. Aparece en el inspector cuando lo encuentra
~~~

- Puedo usar un array

~~~cs
public GameObject[] cubos;

cubos = GameObjec.FindGameObjectsWithTag("Player"); //todos los GameObjects tienen un tag, por defecto viene sin asignar.
                                                //Hay varias pero yo puedo crear la mía con el menú y AddTag
~~~

- Ahora tengo un array con todos los objetos que tengan la etiqueta Player, puedo verlo en el inspector, en el GameObject dónde tenga asociado el script como componente
- Puedo saber cuantos hay con cubos.Length
----

## COMPONENTES

- Cómo se accede a los componentes a través de los GameObject
- Hay que seguir unas normas porque si no va a dar problemas
- Aunque cree un GameObject vacío viene con el componente Transform por defecto
- Le puedo agregar un script como componente
- Para acceder al Transform uso la dotación de punto. Luego en transform accedo a las propiedades con otro punto

~~~cs
Debug.Log(gameObject.transform.position.x);

public GameObject transformCam; //pongo public para que aparezca en el inspector y poderle asociar el componente MiCam arrastrándolo al campo del script en el inspector

//START()
transformCam.position.x;  //accedo al componente Transform de MiCam

//Siq uiero acceder a BoxCollider me creo una variable de ese tipo
//PARA TODOS LOS COMPONENTES QUE NO SON EL TRANSFORM DEBO SEGUIR ESTA ESTRATEGIA

public BoxCollider miCollider;//primero declaro la variable del tipo del componente

//estoy trabajando dentro del gameObject
miCollider = GetComponent<BoxCollider>(); //Segundo accedo a la función GetComponent y almaceno el BoxCollider en la variable

//una de las propiedades son enabled (true or false)
miCollider.enabled = true; //ahora puedo modificar las propiedades del componente
~~~
---

## Comunicación entre GameObjects y Scripts

- Cuando quiero que un GameObject le pregunte a otro para tomar una decisión
- Creo dos scripts, Player y Pared
- Pared.cs:
    - Le añado un valor booleano
~~~cs
public bool paredActiva= true;
~~~

- Player:
    - Necesito acceder al GameObject Pared y al Script
    - Primero necesito acceder al GameObject para poder acceder al script
    
~~~cs
public GameObject paredGO;
public Pared paredScript;

//Start()
paredGO= GameObject.Find("Pared"); //encontrar al GameObject Pared

paredScript = paredGo.GetComponent<Pared>(); //con GetComponent busco el componente Pared ( el script )

//Update()

if (paredScript.paredActiva == false){ //paredActiva es la propiedad de Pared seteada a true
    
    paredGO.setActive(false); //si seteo la propiedad a false entra en el condicional y desactiva el GameObject Pared
}  
~~~

- Ctrl + Shift + F => veo en la pantalla de game lo que tengo en la vista
----

## CLASE OBJECT

- Cuando creas un cubo lo primero que se llama es la clase GameObject
- Luego crea un Objeto de la clase Transform y se lo adjunta y luego va sumando más componentes que son, en realidad, un objeto.
    - Cada componente es un objeto
- Con el método ToString() de la clase Object devuelve el nombre del GameObject
- Los puedo destruir con Destroy
- puedo usar DontDestroyOnLoad
- Tengo disponibles los operadores 
    - bool: existe el operador?
    - !=
    - ==
- Con FindObjectsOfType lo tengo que usar con un objeto array

~~~cs
 HingeJoint[] hinges = Object.FindObjectsOfType(typeof(HingeJoint)) as HingeJoint[];
~~~

- Creo un nuevo script llamado UnObjeto
- Quiero que todos los objetos que contengan el elemento Pared se me almecene en un array
- Como la clase hereda de MonoBehaviour puedo usar la clase Object con el componente Pared porque también es un objeto

~~~cs
public Pared[] arrayDeparedes;

//START()
arrayDeParedes = Object.FindObjectsOfType(typeof (Pared)) as Pared[]; //Según la documentación le tengo que pasar el tipo de dato y lo devuelvo como un array de Pared

Debug.Log(arrayDeParedes.Length);
Debug.Log(arrayDeParedes.ToString()); 
~~~

- Si ahora añado el script a un GameObject, y en el campo Pared del componente script del inspector añado el cubo al que llamé Pared arrastrando
- Entonces puedo buscar por componente y a través del componente acceder al GameObject
- Con la clase Object hay varias herramientas que ayudarán a trabajar con objetos y componentes, que permitirán hacer búsquedas avanzadas y alamcenar todo tipo de información
- Yo podría recorrer con un array el arrayDeParedes y setear a false paredActiva a false para que los elimine a todos de un tirón
----

## CLASE TRANSFORM

- Acceder a la clase Transfrom y a sus propiedades
- Creo una nueva Scene con un cubo
- Creo el script Transformaciones
    - Primero almaceno una referencia del componente (gano en optimización)

~~~cs
private Transform thisTransform = null; //lo inicio en null. A veces si lo almaceno en la inicialización y el componente no está cargado puede dar error

//START()   Al iniciarlo en null e aseguro que en el START almaceno el último estado del componente
        
thisTransform = GetComponent<Transform>(); //De esta manera accedo al transform del objeto al que esta asociado a este script

thisTransform.position = new Vector3(2,2,2);// Necesita pasarle los valores de x, y, z para trasladar el objeto
~~~

- Así puedo acceder de manera local
- Para acceder de forma externa, primero localizo el GameObject 

~~~cs
//Si inicio las variables fuera de una función puedo usarlas en cualquier método dentro de la clase
public GameObject otroGO;
Transform transformOtroGO;

//START()

//hago las búsquedas para llenar la info de las variables
otroGo = GameObject.Find("CuboRojo"); //Genero CuboRojo en la escena y accedo desde aquí
transformOtroGO = otroGO.GetComponent<Transform>();

transformOtroGO.position = new Vector3(-2,-2,-2);
~~~

## Clase Transform y Jerarquías

- La clase Transform tiene un montón de propiedades (mirar la documentación)
    - También puedo acceder a los hijos en las jerarquías de los GameObject desde el código con GetChild (por ejemplo) 
- Antes de empezar a rotar y mover en el Update voy a trabajar con las jerarquías
- Cómo puedo saber si un GameObject tiene hijos, como acceder a ellos desde el código, etc
    - Primero guardo la Transform
    - recorro con un for usando ChildCount que es como un Length de la jerarquía
    - Creo la variable temporal hijoTransform donde almaceno cada hijo y accedo al nombre desde transform
        - Puedo acceder porque gameObject y transform están intimamente relacionados

~~~cs
public Transform miTransform;

//START()

miTransform = GetComponent<Transform>(); //accedo al transform del GameObject local

//a través de una función de Transform voy a recorrer el GameObject para saber si tiene hijos y me muestre sus nombres

for (int i = 0; i < miTransform.ChildCount; i++) //cuenta los hijos, es como un Length en el array
{
    Transform hijoTransform = miTransform.GetChild(i); //con GetChild cada número de hijo que va encontrando lo va poniendo en el i
    Debug.Log(hijoTransform.gameObject.name); //accediendo desde la Transform puedo ir hacia arriba y acceder al gameObject y al nombre
                                            //transform y gameObject están relacionados
}
~~~

- De esta manera puedo acceder a los hijos para aplicarles los que sea,a todos o a uno en específico 
-----

## TRANSFORM en el UPDATE

- Trabajar bien sobre el loop es una parte muy importante de Unity
- Creo un script llamado Movimiento
    - Me traigo el transform
~~~cs
private Transform miTransform = null;
public float velocidad; //Es float porque voy a estar multiplicando Vector3 y almacenará decimales

//START()

miTransform = getComponent<Transform>();


//UPDATE()

miTransform.position += new Vector3(0,0,1); //Le estoy sumando 1 a la posición anterior. A cada frame avanzará una unidad, si voy a 120FPS/seg avanzará 120 unidades

//Si quiero controlarlo a través de una velocidad, tengo que tratar la misma direccion
miTransform.position = new Vector2(0,0,1 * velocidad); // si tiene valores negativos irá en la dirección contrario.
                                                        //ahora velocidad vale 0, 0*0=0, pero si altero este valor puedo controlar la velocidad

//puede ser que yo necesite que se mueva la misma distancia por segundo.
//Al ser los frames por segundo variables puede no funcionar como debe

miTransform.position = new Vector2(0,0,1 * velocidad* Time.deltaTime); //Time.deltaTime garantiza que coja el valor de frames y la velocidad
                                                                        //y los va a distribuir por segundo
//Si le pongo 10 de velocidad se moverá 10 unidades por segundo (10 unidades en la grid de la escena)
//Puedo manejar la variable velocidad desde el inspector
~~~

## Trasladar y rotar en vectores específicos

- Unity provee de funciones como translate y rotate que hacen que usar += para este caso no sea lo más adecuado.

~~~cs

private Transform miTransform = null; //de esta manera dispondré del transform
public float velocidad;
public float velocidadDeRotacion;
//START()

miTransform = GetComponent<Transform>(); //me traigo el Transform


//UPDATE()

//Con .forward irá hacia adelante
miTransform.Translate(Vector3.forward * velocidad * Time.deltaTime); //me pide que vector3 de translación quiero. En la ayuda salen todos los parámetros que le puedo pasar

miTransform.Rotate(Vector3.up * velocidadDeRotación * Time.deltaTime); //Rota en circulo

//velocidad a 10 unidades y de rotación 90, así lo controlo el radio y la velocidad del circulo
//Se puede poner negativo el Vector igual que la velocidad
//Poner -Vector3.up es lo mismo que poner Vector3.down
~~~

- Puedo usar Vector3.propiedad y no necesito usar el constructor new Vector3 cada vez
-----

## CLASE COLLIDER

- Creo dos cubos para prototipar
- Uno de color azul que será Jugador y otro que escalo más pequeño de color verde a poca distancia que será Energía
- Quiero hacer con un translate que el cubo avance y cuando colisione con el verde este desaparezca
- Esto se logra con la mensajería entre componentes que acepta BoxCollider
- Cuando le quitas el mesh puedes ver el box collider
- Pueden detectar el contacto entre dos colliders con la función isTrigger
    - isTrigger activa el servicio de mensajería, lo tengo en el inspector, un checkbox en el componente BoxCollider
    - Con el Trigger activado, cuando el BoxCollider colisione va a mandar un mensaje que podemos capturar
    - Las tres funciones que van a capturar la mensajería que ocurra siempre que dos colliders se encuentren y uno ( o los dos ) tengan el isTrigger activado son:
        - OnTriggerEntry, OnTriggerStay, OnTriggerExit
    - Si tengo la Energía como Trigger cuando entre en contacto con el Juagdor va a mandar un mensaje
- Creo los scripts Jugador y Energía    
- En la clase Energia borro las funciones Start y Update y comienzo a trabajar con el Trigger
- Collider es la clase base de todos los collider: BoxCollider, SphereCollider,CapsuleCollider, MeshCollider, etc
- También está Collider2D que es la misma para trabajar con objetos 2D
    - Tengo funciones como isTrigger() para saber si esta activado el Trigger
    - En la parte de mensajería tengo las tres funciones OnTriggerEntry, OnTriggerStay, OnTriggerExit
    - Mirar documentación oficial
    - Para que esta colisión se dé Jugador tiene  que ser contra un componente rígido
        - Jugador Add Component/rigidBody
        - Le desmarco useGravity

~~~cs
//public class Energia: MonoBehaviour{

    void OnTriggerEnter(Collider other) //uso una referencia del Collider con el que choca para ejecutar el código
    {
        //La condición en que momento tengo que detectar contra quien colisiono para tomar esta decisión de Destroy
        //Tengo que identificar que es el Jugador (que tiene el componente Jugador, el script) quien choca para darle la energía
        //El collider también es un objeto, puedo usar GetComponent

        Debug.Log(other.name); //Para que me diga contra quién estoy chocando

        if(other.GetComponent<Jugador>() != null) // Si el componente Jugador existe
        {

        Destroy(this.gameObject); //Cuando haya una colisión se va a destruir este GameObject ( donde está el script)
                                //Pero para que esta colisión se dé tiene que ser contra un componente rígido
                                //Le añado el componente rigid body al Jugador y le quito useGravity 
        }        

        
    }

    void OnTriggerStay(Collider other)
    {
            //Cuenta todo el tiempo que estoy dentro
    }

    void OnTriggerExit(Collider other)
    {
        //Cuenta cuando salgo
    }
~~~
---

## COLISIONES Y RIGIDBODY

- Vista la Mensajería de OnTriggerEntry, OnTriggerExit y OnTriggerStay vasmos a ver OnCollisionEnter
- En lugar de pasarle el Collider le pasa la Collision
- Va a ocurrir siempre que colisione un collider con RigidBody contra otro collider que puede tener RigidBody o no
- Pongamos que le quito el Trigger en el inspector a la Energia
    - Se convierte en un collider sólido y no me deja pasar con Jugador a través de él
    - Si le añado un rigid body a Energia cuando Jugador choca con Energía actúan las leyes de la física que tengo configuradas en Unity
- Creo un script que se llama ColisionesYRigidBody
- Quito el Start y el Update del script

~~~cs
void OnCollisionEnter(Collision other)
{
    if(other.collider.GetComponent<Jugador>()!= null) //desde el objeto Colisión entro en el Collider y desde ahi uso GetComponent
    {   //esta sentencia podría ser other.GetComponent<Jugador>()!= null
        
        Debug.Log(other.collider.name); // si existe Jugador devuelveme el nombre del objeto que ha colisionado
    }
}

//tambien tengo OnCollisionStay y OnCollisionExit
~~~
----
# CORRUTINAS Y IENUMERATOR

- Las corrutinas se usan para llamar funciones en las que queramos controlar que se ejecute el código en una cantidad dfeterminada de tiempo o de varios tiempos (secuenciar una orden por tiempo, por segundos)
- Pongo 3 cubos en escena, quiero que cada dos segundos se apague un cubo
- Las corrutinas hay que usarlas con respeto. Para muchos elementos y acciones quizá no sea la mejor solución
- Creo un script, lo llamo CORRUTINAS y lo añado a la camara
    - Lo primero que necesito es un array para almacenar esos cubos
~~~cs
public GameObject[] cubos;


//START()

cubos = GameObject.FindGameObjectsWithTag("Player"); //Buscar por strings es más costoso, es mejor buscar por componentes
                        //para que los encuentre deben tener el tag Player
//Fuera del START y el UPDATE

//Las corrutinas tienen que estar siempre  con el tipo IEnumerator

IEnumerator ApagarCubos()
{
    yield return new WaitForSeconds(2.0F); //le tengo que pasar un float, el numero de segundos que quiero que espere, en este caso 2

    Debug.Log("Hola corrutina"); //aparecerá cada 2 segundos
}
~~~

- Para llamar a las corrutinas primero hay que usar StartCoroutine() con el nombre de la corrutina como parámetro

~~~cs
//START()

StartCoroutine(ApagarCubos());
~~~

- Para apagar los cubos voy a la corrutina y en lugar del mensaje añado el código
    - yield sirve en las iteraciones.
    - Ejecuta el primer yield, se ejecuta lo que sea que haya según el flujo, va al segundo yield, etc
    - WaitForSeconds solo puede usarse con yield

~~~cs
IEnumerator ApagarCubos()
{
    yield return new WaitForSeconds(2); //le tengo que pasar el numero de segundos que quiero que espere, en este caso 2

    cubos[0].SetActive(false);

    yield return new WaitForSeconds(2);

    cubos[1].setActive(false);

    yield return new WaitForSeconds(2);

    cubos[2].setActive(false);
}
~~~

- Podría usar un switch case para según el caso haga una acción u otra