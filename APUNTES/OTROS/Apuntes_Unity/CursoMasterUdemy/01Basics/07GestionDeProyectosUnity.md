# GESTIÓN DE PROYECTOS

## Diferencia entre cámara perspectiva y ortográfica

- Camara Perspectiva: proyecto 3D
- Camara ortográfica: proyecto 2D o isométrico (juegos donde se rota la cámara y aún siendo en 2D se puede ver en perspectiva)
    - En isométricos se suele rotar 45º en x. Hay isométricos en 2D y en 3D
    - La diferencia es que en 2D la perspectiva está simulada
- Propiedades del componente de la cámara:
    - Projection: perspective/orthographic
    - Field of View: amplia/reduce el plano
    - Clear Flags: hace referencia al espacio vacío de la cam, dónde no tengo objetos puestos en la escena, qué me va a mostrar
        - puedo poner solid color para que en lugar del SkyBox me muestre negro eligiendo negro en el Background
        - para lo mismo puedo usar Depth only
        - Don't Clear: me muestra lo que mostró el último frame
    - Culling Mask: le podemos decir a la cámara que layer queremos mostrar
        - Voy al elemento cubo de la escena en el inspector, en Layer/Add Layer, y en el Layer 6 le pongo Cubo
        - En Culling Mask puedo decirle que me muestre todo menos Cubo (Laeyr 6) y no me lo muestra en la pantalla de juego
        - De esta manera puedo empezar a filtrar elementos en la cámara
        - Basado en Perspective u Orthographic tenemos distintas opciones de configuración:
            - Perspectiva:
                - FOV Axis ( Field Of View ): Vertical/Horizontal, pensado para realidad virtual, el eje de la cámara
                - Field Of View: Campo de visión de la cámara. Normalmente se trabaja en 60 para asemejar el ojo humano
                - Physical Camara: si lo activo aparecen multitud de opciones
                    - Puedo ajustar la cámara para que se comporte cómo una cámara física (real)
                - Clipping Planes: planos de recorte. Desde dónde quiero que enfoque y hasta dónde quiero que enfoque
                    - Lo que esté dentro del Near y el Far se va a ver, lo que no no
                    - También está disponible en la cámara de la escena
                    - Si se recorta la imagen es el Clipping Plane
                    - Parámetro Near: 0.03 es el Standard
                - ViewPort Rect: si tenemos dos cámaras, podemos elegir el espacio quemuestre una cámara y el espacio que muestre otra
                - Depth, Target texture: si quiero una textura para efectos, HDR, MSAA: cossas de calidad gráfica
                - La última parte del inspector de la cámara está más relacionado con el render y la iluminación
- Cuando definimos el tipo de visualización de cámara del proyecto estamos definiendo todo el estilo gráfico del proyecto
----

## Ajustes de Tamaño y Resolución de la pantalla

- La pantalla de Game, como lapodemos ver en un portátil, en un móvil, cómo lo configuro.
- En la pantalla de Game, en la pestaña Free Aspect
    - Free Aspect: dependiendo del tamaño de la pantalla que yo tenga, la cámara se va a ajustar a ese tamaño y me va a mostrar la escena
    - clic derecho en la pestaña Game (encima de Game) puedo maximizar la pantalla
    - Hay dos tipos de formato, uno es por Aspect y otro es por Pixels
        - 5:4, 4:3, 3:2, 16:10, 16:9 => 16:9 es el aspecto (tamaño de pixeles) que tienen los monitores FULL HD 1900x1080
        - Cómo estoy trabajando con el aspecto y no resolución, mi juego se verá bien en pantalla completa y pantalla reducida
        - Aspecto Stand Alone: muy enfocado a la web
        - También podemos trabajar en Píxeles: de esta manera defino la pantalla de juego
            - Puedo agregar un formato propio con Add
            - Para asegurarme que la pantalla de Game está a ese tamaño revisar la Scale sea 1x
            - Si se ve pixelado también revisar la Scale (escala)
            - Si da igual la pantalla del tamaño que sea le pongo FULLHD en píxeles y luego voy a tener que configurarlo en las opciones del Player
    - Estas opciones aparecen porque estoy construido para PC, Mac y Linux. 
        - Si voy a Build Settings y hago un Switch Plattform a Android, cuando voy  la pestaña Free Aspect de Game hay preconfiguradas varias resoluciones y aspectos. Portrait es vertical, Landscape horizontal
- A la hora de exportar el juego puedo ir a File/Build Settings/Player Settings
    - Varios parámetros:
    - Orientation: Auto-Rotation => a medida que se gire el móvil la pantalla se adapte a la auto-rotación
        - Con Portrait solo lo puede ver en vertical, Landscape en horizontal, Portrait UpSideDown, Landscape right, Landscape left
    - Allowed Orientation: le quito o le pongo las opciones que quiero o no permitir: Landscape, Portrait, etc
- La ventana de Game es una ventana de previsualización que me permite hacer todas las pruebas que yo quiera
- Los elementos de UI se ajustan en el componente Canvas del objeto. Hay que definirlo
----

## Opciones de Build Settings para construcción de proyectos

- File/Build Settings
    - Las Plataformas tipo PS4, XboxOne, etc necesitan de licencia 
    - Android:
        - Texture Compression: Don't override que no sobreescriba la compresión de Unity
        - 16/32 bits
        - Paquete para Google Play
        - Run Device: compatibilidad con dispositivos
        - Development Build: opción de desarrollo
        - Diferentes métodos de compresión
        - Botones construir / construir y ejecutar. Si tengo el movil conectado al ordenador puedo hacer un build and run
            - Puedo hacer un build y luego pasarlo al tlf
    - Pc: un poco más de lo mismo
- Si no sabes qué tocas MEJOR DEJARLO COMO ESTA
- Con Switch Plattform cambio de plataforma
- Player Settings: configuro el nombre de la compañía, del producto, la versión...
    - Icon: me presenta un montón de resoluciones para trabajar
    - Resolution and Presentation ( lo visto antes )
    - Splash Image: La imagen que despliega unity cuando arranca. Sin licencia solo sale el logo de Unity
        - Cuanto tiempo quiero que dure, si se funde con fundido, etc
    - Other Settings
        - Rendering, Color Spaces: relacionado con la iluminación y Render
        - La relación del producto con la compañía
        - Minimum API Level: Para qué version de Android quiero construir
        - target API Level: versión en concreto a la que apunto
    - Publishing Settings:
        - Si tengo una keyStore de la playStore es aquí donde debería configurarla
    - XR Settings:
        - Configuración de Realidad Virtual
            - Con qué SDK trabajar
----

## Diferencias entre proyectos 2D y 3D

- Los proyectos 3D son diferentes en cuanto a la creación de escenas
    - New Scene: puedo elegir una vacía o una Basic Buil in 3D. Con la Basic:
        - La cam principal tiene la Projection en Perspective
        - Me pone una luz direccional
        - Incorpora un SkyBox
    - Todas las texturas que incorpore al proyecto me las importa como Texture Type: Default. Creo un material al que pasarle la textura y lo arrastro al GameObject
- Puedo convertir este proyecto 3D a uno 2D
    - Edit/Project Settings/Editor/Default Behaviour Mode: en 2D o 3D
    - Si lo cambio a 2D y ahora voy a File/NewScene me agrega a las opciones preconfiguradas que me ofrece una en 2D
    - Ya no tengo el SkyBox en esta nueva escena 2D dentro del proyecto 3D, si en Escena cambio la perspectiva a 2D, aunque no tenga seleccionada la cámara me dibuja un rectángulo en el grid, como un lienzo. Me está mostrando el tamaño
        - Esto en escenas 3D no pasa, solo me lo muestra si selecciono la cámara
- Los proyectos 2:
    - Al importar una imagen en la ventana de Proyectos me lo importa como Sprite(2D and UI) por Default
    - Con el rectángulo que marca la visión de la cámara sobre el grid puedo saber lo que se está viendo y lo que no
    - El rectángulo me sirve de Canvas
----

## Uso de Layers- Gestión de visibilidad

- Sistema de capas (Layers)
- En Layers encima del inspector me salen un montón de capas ya creadas. del 0 al 5 tengo
    - Default, TransparentFX, IgnoreRayCast, Water, UI
    - Puedo crear un nuevo Layer con Add Layer
- Con Culling Mask (inspector de la cámara) elijo que layers veo y que no con la cámara 
- Con los Layers puedo filtrar la visibilidad de los objetos y la interactividad
    - En la escena lo sigo teninedo, pero en la ventana de Game no se ve
- Puedo seleccionar un objeto y en el inspector moverlo a un Layer para que no se vea
- Puedo tener varias cámaras y que unas filtren una cosa, otras filtren otra
- Gestión de interactividad:
    - La interactividad la podemos definir a través del RayCast. Es un rayo que podemos lanzar con cualquier GameObject o incluso con el ratón
    - Ese rayo va recorriendo la escena, le podemos dar una distáncia, un color...
    - Le puedo decir que si ese rayo tiene alguna colisión, basado en esa colisión podemos tomar decisiones
    - Cuando trabajamos con rayos trabajamos con físicas(Physics.RayCast). RayCast significa detecciónd e rayo
    - Ejemplo de código
~~~cs
// Bit shift de index of layer (8) to get a bit mask
int layerMask = 1 << 2; 

//This would cast rays only against colliders in layer 8
//But instead we want collide against everything except layer 8. The ~ operator does this, it inverts a bitmask

layerMask = ~layerMask;

RayCastHit hit;

if(Physics.RayCast(transform.position, transformDirection(Vector3.forward)), out hit, Mathf.Infinity, layerMask)
    {
        Debug.Log("Did Hit!")
    }
~~~
    - Si le añado el script del rayo a la camara (el script completo), la camara lanza un rayo en el eje Z (hacia adelante)
    - Si algún objeto toca ese rayo ejecuta el código dentro del if
    - El Layer 2 ignora el RayCast por defecto
    - Si pongo el cubo en el Layer2 el rayo no lo detecta y no ejecuta el código
----

## Uso y gestión de etiquetas o TAGS

- Cuando creo un GameObject por defecto viene sin ninguna etiqueta
    - debajo del Nombre en el inspector, Tag: Untagged
    - Hay varias etiquetas preestablecidas que se despliegan
    - Puedo añadir una etiqueta desde aquí con Add Tag y también desde los Layers, Add Layer
- Las etiquetas me permiten marcar el HameObject en la jerarquía y luego esa etiqueta me servirá en el código para localizarlo
- Me permite agrupar GameObjects en la misma etiqueta
    - Creo la etiqueta Enemigo, por ejemplo
    - En Tag del inspector del GameObject selecciono Enemigo
- Algunos GameObjects vienen etiquetados por defecto, como MainCamera que viene etiquetada como Main Camera
- Las etiquetas están limitadas (32), por ello debemos usarlas con precaución:
    - O para etiquetar varios elementos a la vez o distinguir a uno de los demás
    - No depender tanto del nombre y más por la etiqueta
- Dan una posibilidad de busqueda muy efectiva y funcional, así como de agrupar o distinguir
- Por ejemplo la etiqueta GameController, va a ser el GameObject que va a controlar con varios scripts todo el juego, almacenando datos y distribuyendo información (quizás)
---

## Organización y Estructura de Proyectos

- Unity establece un standard porque si no, al descargar paquetes, herramientas, materiales, sería un caos
- Organiza los archivos por tipos de Assets. Clic derecho/Create/Folder
    - Materiales en la carpeta Materials, carpeta Scripts para los scripts, modelos en Models, etc
    - Luego dentro de las carpetas lo organizas como quieras
- RECUERDA: SOLO PUEDO GUARDAR EN LA CARPETA ASSETS
- En la parte superior de la ventana de Proyectos esta la barra de navegación, puedo clicar encima para ver
    - Es lo mismo que clicar sobre las carpetas a la izquierda de la ventana de Proyectos
----

## Busqueda de Assets por Tipos y por Etiquetas

- top-right de la ventana Project tengo:
    - La barra de búsqueda. Puedo buscar por nombre pero también por tipos <Tipo>NombreDelAsset
    - Icono 1: buscar por tipos de Assets. Buscar todo lo que sea Animation Clip, por ejemplo
    - Icono 2: buscar por etiquetas.
        - Si selecciono un modelo, en el inspector bottom-right hay un icono azul= Es para asignar una etiqueta de gestión de proyectos
        - Estas etiquetas son diferentes que las TAGS con las que puedo acceder desde el código, son para gestionar el proyecto
        - Si etiqueto el padre automaticamente me etiqueta los hijos
        - Si me equivoqué de etiqueta voy al icono azul del inspector del objeto (bottom-right) y la desmarco
        - Puedo escribir la etiqueta en la barra blanca superior + Enter y añade la etiqueta
             - Si la desmarco desaparece del menú desplegable del icono azul de etiqueta
    - Icono 3: (estrellita) Guardar búsquedas
    - Icono 4: ocultar la carpeta de paquetes
----

