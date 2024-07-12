# IMAGENES TEXTURAS3D Y 2D

## Texturas

- Formatos soportados:
    - .BMP, .EXP, .GIF, .HDR, .IFF, .JPEG, .PICT, .PNG, .PSD, .TGA, .TIFF
    - PNG, PSD soportan canal Alpha (transparencias)
- El tamaño es importantisiomo en Unity, Unity usa potencias de 2
    - El tamaño viene en píxeles
    - Yo puedo crear una imagen que de ancho sea 2 elevado a 8= 256 y de alto 2 elevado a 10=1024
    - Es importante usar potencias de 2 para que elmotor a la hora de leer esa imagen, almacenarla en memoria y procesarla en tiempo real va a optimizar muchísimo mejor que si me muevo fuera de las potencias de 2
    - Por lo general para PC's se usa 4096, para móviles 2048
- Texturas 3D
    - Un mapeo UV. UV son las direcciones superior y lateral. Cuando hablamos de 2D en 3D hablamos de UV
    - Imagina un caja de cartón con forma de ratón, y la despliegas hasta dejarlo en un plano.
    - Eso es lo que se hace con la malla en el mapeo UV
    - Una vez que está toda la malla dispuesta pasamos a texturizar sobre ese mapeo
        - Pinto la cara, los ojos dónde corresponde, etc
    - Las texturas 3D son mapeos, un cuadrado con todo lo que conforman el modelo: las piernas, los brazos, etc
    - Texture Tiles son texturas repetitivas, cómo puede ser rajolas, zócalo
    - texturas de repetición son aquellas que puedo repetir X veces y no se ve la unión
- Texturas 2D:
    - Definen los elemntos del juego en 2D
    - También las tengo que importar en potencias de 2
    - Una vez dentro de Unity puedo recortar todas las partes y luego ir poniéndolas
    - De este modo almaceno una sola textura y trabajo desde esa textura sacando partes

## Flujo de trabajo

- Importo las texturas en la carpeta Assets/Textures
- En el inspector aparecen varias opciones:
    - Abajo, en el preview, me dice si la imagen es RGB o RGBA ( A de Alplha, con transparencia)
    - En el preview puedo gestionar la compresión con %
    - Texture Type: si la voy a usar para malla 3D o 2D
        - Para 3D puedo usar Default  o Normal Map que simula relieves
        - Si fuera una textura 2D yo usaría Sprite 2D and UI
    - Texture Shape: 2D ( aunque trabaje con 3D, esto es más avanzado luego se verá)
    - Advanced: Diferentes opciones para gestionar los canales de transparencia, definir la visualización y la compresión
    - Wrap Mode, Filter Mode: Diferentes algoritmos para repetir y filtrado de pixeles
    - Diferentes compresiones según la plataforma: vienen compresiones preestablecidas
- Texturizar una esfera:
    - Traigo una esfera a la escena
    - Necesito pasar las texturas por un material
    - Todas las figuras tienen un material por defecto que usa Unity por lo que debo crear un nuevo material
        - clic dereho/Create/Material
    - La textura, en el inspector, se conecta con un Shader, que es un script que me permite darles propiedades a las texturas
        - Propiedades de color, propiedades de brillo, de relieve, luces y sombras, etc.
        - Shaders es un módulo aparte
        - El Standard se usa para objetos metálicos
        - El Standard Specular setup para objetos que no son metálicos
        - Cómo es una piedra el Shader será Standard Specular setup ( cambia en la forma de interpretar los brillos)
    - En el inspector/Main Maps arrastro la textura col1 ( color ) al Albedo. Es el inspector del material que creé llamado Rocks
    - Ahora arrastro el material Rocks a la esfera de la escena 
    - En el inspector, en el Specular hablamos de brillos
    - Normal Map y Height Map son canales que me permiten a partir de la textura definir relieve
        - Conecto la textura con la palabra height en el nombre con el canal Height Map
        - Lo mismo con la textura con normal en el nombre al canal Normal Map
            - El Texture Type ya no será Default, será Normal. Apply!
    - Oclussion son luces y sombras, le añado la textura con AO en el nombre al canbal Occlusion arrastrándola a <>Oclussion del inspector del material Rocks
----

## Texturas 2D- Atlas y Sprites

- Arrastro una textura a la carpeta Assets/Textures en la ventana de Proyecto
- Si el proyecto es 3D me la va a importar por defecto en 3D
- Un Atlas es una imagen grande que dentro tiene un conjunto de imagenes pequeñas, cada imagen es un Sprite ( Sprite significa duende, buscar wikipedia)
- En el inspector hay varias opciones:
    - Texture Type: Sprite(2D and UI) en este caso
    - Sprite Mode: Multiple=> cuando hay varios sprites en la textura
    - Configuraciones de tamaño: Pixels per Unit, Mesh Type, se verá en detalle cuando se vea el motor de 2D
    - Advanced: configuración de canal Alpha
        - SAlpha Source: Input Texture Alpha. Si es RGBA y .PNG lo negro del fondo de la textura se hará transparente 
        - Lo mismo, Wrap Mode y Filter Mode
    - La Compresión para distintas plataformas
    - Le doy a Apply!!
- Antes de llegar a la seccion Advanced en el inspector esta el botón de Sprite Editor
- Si no está hay que incorporarlo a través del Package Manager
- Window/Package Manager 
    - Hay varias opciones en la pestaña Packages: In Project. Tengo Unity Registry, My Assets, Built in
    - 2D Sprite es el que busco, está en Unity Registry
        - En el lado derecho, bottom-left está el botón de install
- Tengo el sprite editor, selecciono la imagen y lo abro desde el inspector
    - Seleccionando con el ratón las imágenes manteniendo clicado, cuando tengo varias le doy a Apply
    - Ahora la textura 2D ya no es una imagen sola si no que tiene en su jerarquía (dentro de la ventana Proyecto) las imagenes que he "recortado"
- Si añado uno de los sprites a la escena, tiene un componente de Sprite Renderer que me permite conectar el GameObject con el Sprite
- Se profundizará mucho más en el módulo 2D
-----

## Recorrido del Menú Assets

- Desde Create:
    - Después de Folder (carpeta) están todas las opciones de código
    - textMeshPro es para trabajar con textos
    - Escenas, PreFabs
    - Audio Mixer: se pueden conectar con diferentes Audio Source y hacer una mezcla
    - Materiales, texturas, iluminación
    - Animaciones
    - Timeline y Signal crea diferentes efectos de visualización del juego
    - Fisicas
    - UIToolkit: la user interface
- Show in Explorer: me muestra dónde está lo que busco en el disco duro
- Import new Asset
- Import/Export Package
- Find References in Scene: para saber si está o no un objeto en la escena. Lo selecciono en la ventana de proyectos, clico en Find y me lo muestra si está
- Select Dependencies: me muestra las dependencias de un objeto
- Reimport All, reimporta todo
- Properties me muestra las propiedades de la carpeta (clic derecho sobre ventana de proyectos)
    - Asset Bundle: para crear paquetes que puedo descargar por partes (para juegos muy pesados, a veces superan los limites de la tienda)
        - Primero te descargas una parte y al descargarla se descarga el resto

