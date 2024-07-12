# UNITY 2D 

- El proyecto 2D carga por defecto la cámara ortográfica, no tenemos el eje Z
- Ya no me pone la luz direccional
- En la escena me muestra el tamaño de la cámara
    - Si en la pantalla de Game tengo la pestaña Free Aspect, si cambio la forma de la pantalla de Game, la cámara dibuja el mismo espacio que la pantalla en la escena
    - Cuando trabajo en 2D me interesa fijar un tamaño/aspecto de cámara (16:9, por ejemplo)
    - En lugar de Free Aspect le puedo poner FullHD(1920x1080) o cualquiera de las opciones, Landscape, Portrait
- Todas las imagenes que importe en el proyecto 2D serán sprites
----

## Herramienta RecTool

- Es el cuadrado
    - Permite hacer transformaciones (escalar en X e Y, rotar) a imágenes 2D con mucha soltura
- Para escalar con snap manteniendo la proporción, escalar + Shift
    - Para que lo haga desde el centro, Shift + Alt + escalar
- También puedo arrastrar el elemento
-----

## Modo Sprites 2D (and UI)

- Los sprites sirven tanto para trabajar en 2D como la UI (User Interface)
- Si quiero que la imagen importada sirva como un material, por ejemplo, en el inspector, Texture Type: Default (y darle al Apply)
- Los Sprites los muestra en la ventana Proyecto con un play
    - El play me muestra la imagen (o imágenes) que contiene
----

## Cómo activar Sprite Editor

- Usar el Package Manager, Window/Package Manager / Unity Register el paquete 2D Sprite
    - Instala varias cosas, entre ellas el Sprite Editor
----

## Modos de Sprite

- Sprite Mode
    - Single: imágen única. Solo una imágen dentro. Se le llama Sprite
    - Multiple: varias imágenes(sprites) dentro de la imagen. Se le llama Atlas
        - Carga una sola imagen en memoria, pero luego yo puedo subdividir las imágenes
        - Cuando está en Modo Multiple, tengo que seleccionar con el Sprite Editor cuáles son las imágenes que hay dentro
        - Puedo entrar en el Sprite Editor desde el inspector
            - Top-left, Sprite Editor, Slice /Automatic (para que haga los recortes de forma automática, puede dar errores)
            - Apply
    - Polygon: si lo pongo en modo Polygon y voy al Sprite Editor, top-Left Sides: cuantos lados quiero recortar la imágen. Útil para botones, por ejemplo
    - Para resetear la imagen => Custom Outline a 0, Apply
- Muy convenientes el uso de Atlas para minimizar las llamadas gráficas
----

## Unidades de Pixel y Ajuste de Mallas 2D

- Cuando escalo la imagen en la escena no estoy modificando el tamaño original
    - Para adaptar las unidades de la imagen con Unity está el campo Pixel Per Unit en el inspector
        - Si tengo el valor de 100 == cada 100 pixeles 1 unidad (por defecto)
        - Si la quiero más grande le puedo decir que ocupe 50 Pixeles por unidad
    - Mesh Type (tipo de malla)
        - Full rect: En 2D, si lo pongo en WireFrame veo que dibuja un cuadrado con 2 rectángulos
            - Encima de estos espacios pega la imagen (Full Rect es por defecto)
        - Cuando procesa transparencias es mucho mas costoso que cuando no
            - Para ajustar la malla al contenido se usa la opción Tight
            - recomendado para imagenes independientes. Para los Atlas no tiene sentido
    - Extrude Edges: 
    - Pivot:
----

## Canales Alpha y configuraciones

- En el inspector del Sprite, Advanced
    - sRGB(Color Texture): relacionado a como el software interpreta las imagenes y las devuelve al monitor con la mejor aproximación de color que capta el ojo
    - Alpha Source. Los PNG tienen transparencia (canal Alpha)
        - Input Texture Alpha: me detecta la transparencia
        - From Gray Scale: los JPG no tienen canal Alpha. Si tengo un cuadrado blanco con un círculo negro en el centro; si uso esta opción, Unity interpreta que el círculo negro es una transparencia. Blanco es el contenido, negro la transparencia. Los grises serían diferentes valores de transparencia
    - Alpha is Transparency, si lo desmarco ya no interpreta el circulo negro como una transparencia
    - Ignore PNG file gamma: avanzado
    - Read and Write Enabled: me permite modificar la info de los pixeles por código
    - Generate Mip Maps: dependiendo de la distancia de la imagen con la cam
        - cuanto más cerca de la cámara mayor calidad
---

## Opciones dde compresión por plataforma

- Wrap Mode y Filter Mode: cómo procesar los colores de los pixeles
    - dejarlo en Clamp y Bilinear si no se sabe lo que se toca
- Compresiones por plataforma
- Se recomienda no tocar nada si no se está documentado
    - Default
        - Tamaño máximo de textura: 2048
        - Algorithm: avanzado
        - Formato Automático
        - Compresión normal
    - PC: override for PC
        - dejar por defecto
    - Android: marcar override for Android
        - dejar po defecto
    
----

## Creación de GameObjects 2D

- Arrastro el asset a la jerarquía, me lo pone en el 0,0,0
    - Además del Transform aparece un componente nuevo en el inspector llamado Sprite Renderer
        - Se encarga de conectar con la imagen en el campo Sprite 
- Lo puedo arrastrar dónde quiera a la pantalla directamente
- Si arrastro un Atlas a la jerarquía me pondra el primer Sprite que tenga (índice 0)
    - Puedo arrastrar y colocar el sprite que quiera desde el Atlas
    - Los renombra automaticamente con el numero de corte (el índice)
        - Recomendable renombrarlas
----

## Sprite Renderer

- Puedo crear un GameObject vacío y añadirle un componente de Sprite Renderer
    - Campos:
        - Sprite: me permite conectar con el Asset. Puedo arrastralo al campo desde Proyecto directamente
        - Color: puedo usar el color Picker. Tinta el Sprite. Puedo usar el canal Alpha de transparencia
        - Flip: permite orientar el sprite en cualquiera de las direcciones
        - Draw Mode: 
            - Simple: la imagen pegada al plano, si lo agrando la imagen se acomoda al 100%
            - Tiled: a medida que estiro la imagen me dibuja otro plano del sprite
            - Sliced: pensado para botones, elementos de la UI o nubes, por ejemplo, para hacer nubes más grandes o más pequeñas todo desde un mismo Sprite
                - Entro en el Sprite Editor, lo que quede fuera del rectángulo lo va a mantener
                - Lo que haya dentro del rectángulo, cuando agrande o achique el Sprite lo va a escalar
        - Yo le puedo decir en que orden quiero que se dibujen en la pantalla de Game
        - Para ello puedo usar Sorting Layer: Default y en Order in Layer indicar la capa: 1, -1, 23, etc
        - Sprite Sort Point: avanzado
        - Mask Interaction: siguiente lección
----

## Máscaras de transparencia

- Las máscaras se aplican a la transparencia
    - Puedo definir una máscara delante del objeto sobre una zona y decidir si es transparente o no
    - Le añado el componente **Sprite Mask**
        - En el campo Sprite puedo elegir que imagen va a estar por encima
        - En Mask Interaction elijo la visibilidad:
            - Visibility Inside the Mask: muestra solo lo que hay dentro del área de la máscara
            - Visible Outside the Mask: muestra lo que hay fuera de la máscara
        - En el componente Sprite Mask puedo jugar con los valores
---

## Herramienta Sorting Layers y Orders

- Sorting es disposición, orden
- Sorting in Layer
    - Add Sorting Layer: 
        - Sorting Layers ( son los que afectan a los elementos 2D )
            - Puedo tener varios Layers y nombrarlos, reordenarlos
            - Cuanto más alto es el numero mayor indice de visibilidad ( al frente )
- Ording in Layer
    - Me sirve para establecer ordenes dentro de cada layer. Es cómo un subindice del Layer
-----

## Sprite Editor

- Selecciono el padre del Atlas y voy al boton Sprite Editor del inspector
- Top-left 
    - Sprite Editor (en modo Single)
        - Con una imagen en modo Single puedo cambiarle el punto de pivote y tamaño
    - Custom Outline: me permite editar desde cada extremo
        - Puedo ir agregándole vértices y dibujar la forma que quiera
        - Para que se vean los cambios el tipo de malla (Mesh Type) tiene que ser Tight
        - recordar darle al Apply!
    - Custom Physics Shapes: forma específica para las colisiones.
        - Debo agregarle un Polygon Collider 
    - Secondary Textures: me permite agregar texturas y desde un Shader a través de código poder aplicarle más texturas
    - Si le pongo el canal Alpha y aparece todo blanco es que no tiene canal Alpha
- Con Modo Multiple en el Sprite se despliegan más herramientas

## Sprite Editor Modo Multiple

- Los Atlas (varios sprites en una imagen) siempre tienen que estar en potencia de 2 (luego se verá)
    - Abro el Sprite Editor desde el inspector del Atlas 
    - Antes lo pongo en Sprite Mode: Multiple y Full rect para optimizar la malla, que sean mallas cuadradas
    - En el Sprite Editor:
        - Ruedita: zoom
        - Clic izquierdo y arrastro defino el tamaño del Sprite
        - Bottom-right tengo el nombre, me dice el tamaño, donde esta el punto de pivote, el tipo de Pivote
        - defino los Sprites con clic izquierdo y arrastrando, rodeando el sprite con el rectángulo y le doy a Apply
        - Ahora, si voy a Proyecto los tengo disponible
-----

## Sprite Editor Modo Multiple Edición Auto

- Top-left, Slice (corte) Type: Manual, Auto, Por Tamaño de Celda o por Cantidad de celda
    - Auto: me recorta los sprites automáticamente. Lo que hace es trabajar sobre el canal Alpha
    - Donde detecta contenido lo mantiene dentro del Sprite. Puedo Cambiar al canal Alpha en el Sprite Editor para comprobar si hizo bien los recortes
    - Por ejemplo, detecta pixeles sueltos en el Atlas y genera Sprites de ellos
        - No voy a tener la numeración correlativa
        - Voy a tener que eliminar esos Sprites de 1 px
    - Debo evaluar si vale la pena. Si trabaja bien, genial, si no a mano
    - Puedo probar el Grid By Cell Count, debo indicarle cuantas columnas y filas
        - Column and Row: por ejemplo, depende de la imagen 8x8
        - Le doy a Slice y los recorta 
        - Me hace un grid basado en la cantidad de celdas y no el tamaño
        - Conviene comprobarlo con el canal Alpha, situado top-right tercer icono
    - Para hacer por tamaño (Cell Size), necesito saber el tamaño real del Atlas
        - Pongamos que el Atlas mide 2048x2048 y tengo 8 elementos por fila = 2048/8 = 256
        - Si le digo 256x256 en Column y Row a Slice me hace la división de los Sprites
----

## Rendimiento y llamadas gráficas

- Para Unity solo cuenta lo que entra en la cámara
- Lo contabiliza cuando aparece en la cámara y lo mete en el cálculo gráfico
- En el botón de Stats en la ventana de Game puedo ver SetPathsCalls: son las llamadas gráficas
    - Si pongo una imagen en la escena dentro de la cámara sale 1, si la quito 0
    - Significa que cuando está dentro lo almacenba en memoria, la procesa y hace todo lo que tiene que hacer
    - Si añado los Sprites de un mismo Atlas es solo 1 llamada gráfica
    - Si añado el mismo objeto 2 veces es solo 1 llamada
    - Es importante mantener el número de llamadas gráficas lo más bajo posible
----

## Optimización gráfica potencias de 2

- Tanto para Atlas como materiales, texturas 3D conviene trabajar con potencias de 2
- Porque OpenGL optimiza mejor su rendimiento, y redibuja mejor por el tema DE LOS BITS (0 Y 1)
- Siempre en potencia de 2 para facilitar el cálculo de la imagen y el recálculo del escalado de la imagen si está más lejos, más cerca
- Conviene leer Guía de buenas prácticas para assets de arte ( documentación Unity )
- Puede haber combinaciones de altura y ancho de potencias de 2, no tiene porque ser cuadrado
- En general se trabaja como máximo en 2048
----

## Técnicas de optimización de Atlas de Sprites 2D
----

## Edición de Punto de Pivote

- En la pantalla de escena, no puedo mover el punto de Pivote de un Sprite
    - Hay que hacerlo desde el Sprite Editor
    - Puedo mover el pivote desde el editor ( Apply )
    - Le cambio el pivote desde la pestaña Pivote / Center