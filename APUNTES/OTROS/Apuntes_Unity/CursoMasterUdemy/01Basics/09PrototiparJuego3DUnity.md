# APUNTES PROTOTIPO 3D

- Para introducir los assets a la escena es mejor arrastrarlos a la jerarquía que directamente a la escena para que me lo ponga en el 0,0,0
- Para unir bloques, Ctrl+D para duplicar, con V selecciono que vertice quiero unir para unirlos
- Con E activo la rotación, elijo el eje y con Ctrl hago una rotación con snap de 15º cada movimiento
- Con las primeras plataformas colocadas me interesa probar la jugabilidad
    - Para ver lo que veo en la cámara en la pantalla de Game: seleccionar la MainCam y Ctrl+Shift+F
---

## Colocando personaje 3D con controladores

- Standard Assets ( paquete de Unity )/Characters/PreFab/ThirdPersonController
- Para poder mover grupos de elementos:
    - Slecciono los elementos, clic derecho/Create Empty Parent
    - Ahora tengo un padre GameObject vacío en la jerarquía
- El PreFab de ThirdPerson, si lo selecciono, puedo ver su cápsula de colisión, que usa para poder detectar paredes, objetos...
    - Debo vigilar que la cápsula no se meta en ninguna geometría al incio ( incluido el suelo )
    - Este ThirdPerson PreFab tiene un Rigid Body
    - Selecciono al personaje y lo situo en el eje y un poco más arriba para que cuando inicie el juego, caiga por la gravedad
    - De esta manera me aseguro de que no colisione con nada al inicio
----

## Creando limites del juego

- Coloco una colisión abajo de todo el tinglado de plataformas para que cuando el personaje caiga vuelva a empezar el juego
    - Creo un GameObject vacío
    - Le añado un Box Collider
    - En size le pongo 50 en X, 1 en Y, 50 en Z. Estoy creando un collider que cubra mi circuito de juego por debajo por si caigo que el collider lo detecte
    - Ahora debo añadirle el script. Add Component/ new Script /(nombre del script)/ Create and Add
    - Abro el script
    - Borro start() y update()
    - Uso la función void OnCollisionEnter. Esta función creada por Unity hace que el gameObject que tenga este script cuando colisione va a entrar en esta función
    - En este caso con la colisión quiero acceder a la gestión de escenas
        - Uso la librería de UnityEngine.SceneManagement
~~~cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LimiteSuelo : MonoBehaviour
{

    private void OnCollisionEnter(Collision collision)
    {
        SceneManager.LoadScene(0); //le debo indicar el índice de la posición de la escena que quiero cargar
                                   //como solo tengo una es el 0
        
        
    }
}
~~~
- File/Build Settings / Add Open Scenes y tengo la escena que me interesa en el indice 0
---

## Ajustes de iluminación

- Ahora pasa que cuando muero, al recargar se pierden parámetros de iluminación
    - No estoy almacenando los datos de luz indirecta
    - Para almacenarlos:
        - Window/Rendering/Lighting/RealTimeLightMaps le doy a generate Ligthing
        - Esto crea en la carpeta de Scene, una carpeta con el nombre de la escena y dentro la info de iluminación
----

## Seguimiento de la cámara

- StandardAssets/Utilities/ hay dos scripts: FollowTarget y SmoothFollow
    - La cámara es el objeto y el personaje es el objeto a seguir
    - Añado el script FollowTarget arrastrando el script a AddComponent del inspector de la Main Cam
        - En el script, arrastro el personaje de la jerarquía al campo target del script (en el inspector)
        - Puedo situar la cámara modificando las coordenadas en el script de FollowTarget en la MainCam
        - En este caso pongo -4 de x, y en 4.3 y z 0
        - Si modifico los valores en tiempo de ejecución cuando salga de la ventana Game se perderán
            - Uso la opción del menú de tres puntos Copy Component Values, paro la escena y ahora puedo usar Paste Component Values
    - SmoothFollow tiene más parámetros
        - Distance
        - Rotation Damping: le pongo 2, por ejemplo, la cámara rota y siempre se posiciona por detrás
        - Height Damping: cuando le pongo un valor puedo ajustar la inclinación de la cámara con el Height
----

## Herramientas

- Desactivo la MainCam y voy a usar los camera rigs de StandardAssets/Camaras/Prefabs/FreeLookCameraRig
    - Arrastro la cámara a la jerarquía
    - Le colo el target en el inspector
    - Ahora con el mouse direcciono la cámara y con las flechas muevo
    - Puedo usar MultiPurpouseCameraRig
    - Altura y diustancia puedo usar el Pivote de la cámara, para la rotación usar el inspector
----

## FPC- First Person Controller

    - Puedo definir la alturta del Capsule Collider en Height del inspector, también la dirección
    - Con Radius aumento el radio de la capsula 
- En el script ThirdPersonCharacter hay varias opciones que tocar, como el jump power, velocidad de movimiento, 
- Ground Check Distance es cuando estoy en una curva, o una cuesta, la capsula a cuanta distancia queremos que detecte a una distancia de suelo
    - Si estoy subiendo una cuesta y me hace el efecto de saltar es que tengo bajo el Ground Check Distance
- First Person Controller
    - Ya viene con una cámara
    - También hay que vigilar que el collider no choque con el suelo
    - Debo añadirle un Box Collider.
    - Tiene multitud de parámetros
        - Walk Speed: la velocidad de los pasos
        - Run Speed: velocidad de correr
        - Use Head Bub: desmarcado ya no da pasos al caminar, solo avanza
---

## Ajustes Finales y generando el EXE

- EN FPC 
    - También hay que vigilar que el collider no choque con el suelo
    - Debo añadirle un Box Collider. Le marco isTrigger para que detecte contactos sin colisionar, ahora es un disparador de eventos
    - En el script LimiteSuelo escribo otra función ya desarrollada por Unity que es void OnTriggerEnter

~~~cs
   private void OnTriggerEnter(Collider other)
    {
        SceneManager.LoadScene(0);
    }
~~~

- Construir
    - File/BuildSettings/Player
        - Nombre, compañía..
        - Resolution and Presentation: 16:9 es un standard
            - FullScreenMode: Full Screen Window- Voy a tener que escribir un script que me permita salir del modo completo con el scape
            - Le puedo agregar el script de salida al componente LimiteSuelo (por ejemplo)
~~~cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Salida : MonoBehaviour
{
  
    void Update()
    {
        if(Input.GetKey(KeyCode.Escape)) //Para acceder a la entrada uso la clase Input, pueden ser de teclado, de joystick, mouse, etc
        {
            Application.Quit();
        }
     }
}
~~~

- File/BuildSettings/Build: selecciono la ubicación
    - Si uso escape salgo del juego
----

## EXTRAS:

- Muteo los elementos del ThirdPersonComponent en la jerarquía
- PolygonStarter/Characters
    - Lo llevo como hijo de ThirdPerson. Si me dice que no se puede hacer abro el PreFab, muteo los elementos y añado el "muñeco" de Polygon como hijo
    - Para que mi personaje funcione debo actualizar el Avatar. El Avatar contiene toda la info de los huesos, genéricos, es el que relaciona esos huesos con las animaciones
    - Independientemente de la malla que yo tenga puedo ir cambiando los personajes usando el mismo Avatar.
        - Un mismo set de animaciones, si sigo la misma regla de huesos, me puede valer para todos los personajes
        - ThirdPersonController/Animator (en el inspector)
- PolygonStarter/Materials/Plane
    - Tengo el mismo material de diferentes colores. Lo puedo arrastrar desde el arbol de proyectos a los objetos y lo toma
    - Puedo usar los colores para estructurar el juego
- StandardAssets/Prototyping/Prefabs: varios elementos para prototipar
 