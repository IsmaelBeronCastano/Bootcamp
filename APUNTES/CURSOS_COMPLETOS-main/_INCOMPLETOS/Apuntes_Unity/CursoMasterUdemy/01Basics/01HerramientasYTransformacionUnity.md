# 1 Herramientas y Transformación UNITY

## Herramientas

- Teclas QWERTY para seleccionar una herramienta u otra
----
## Moverse con la camara

- Seleccionar objeto desde Herarchy o desde la pantalla con la herramienta W
    - F para foco sobre el objeto
    - Alt + clic izquierdo para panear sobre el objeto
    - Alt + clic ruedita para izquierda-derecha, arriba-abajo
- Zoom ruedita 
    - También Alt + clic derecho y hacia arriba o hacia abajo para acercarse y alejarse
- Si a estas opciones les sumo shift se aceleran los desplazamientos

----

## Moverse en primera persona

- Clic derecho activa el movimiento en primera persona (el cursor es un ojo)
- Me muevo con las teclas WASD

-----

## Selecciones de objetos

- Clic izquierdo con la herramienta W sobre el objeto o desde Herarchy
- Puedo hacer una selección múltiple manteniendo el clic izquierdo apretado y rodear los objetos
- Para ver los objetos seleccionados con una linea de color es la opción Selection Outline en la herramienta de Gizmos
- Para cambiar elpunto de pivote de la selección apretar shift y clicar sobre el objeto al que quiero cambiar
- Con Ctrl puedo restar a la selección
- Ctrl + D hace una copia
- Ctrl + A Selecciona todo
- Shift + D Deselecciona todo
- Ctrl + I invierto la selección
- Hay más...
----

## Transformación básica

- Hay tres opciones: posición, rotación y escala (todos con X,Y,Z)
- Para mover herramienta tecla W
- Rotar tecla E
- Escalar tecla R
    - W:
        - En el gizmo, donde confluyen X e Y, o X y Z (por ejemplo) hay un cuadradito, suma los dos ejes
            - Útil para mover sólo en X y Z y no en Y
    - E:
        - Puedo hacer rotación libre
        - El círculo blanco es la rotación en la dirección que se ve la cámara
    - R:
        - Puedo escalar en cualquiera de los ejes y también en los 3 ejes
    - Y:
        - La multi-herramienta: suma WER todo en uno
----

## Sistema de unidades métricas de Unity

- Unity trabaja en metros
- Cada cuadrado del Grill es un metro
- Para cambiar la unidad de medición del Grill buscar Grid
    - 1X 1Y 1Z es 1 metro
- Lo habitual es trabajar con 1 metro
- Con Handle puedo mover el punto de origen del Grid donde haya seleccionado previamente de la pantalla ( cualquier objeto )
- Reset vuelve al 0,0,0
- Para decirme en qué posición están los objetos, necesita un punto de referencia. Es este punto 0,0,0
----

## Transformaciones precisas y ajustadas

- Puedo usar el Transform del inspector para, por ejemplo rotar en exactamente 90º poniendo 90 en el eje que desee de Rotation
- Si lo quiero mover 10 unidades (metros) en X pongo 10 en Position
- Estos numeros aceptan decimales y operaciones matemáticas
- Es interesante que el objeto parta de la posición 0,0,0. Para ello puedo darle a Reset en el menú de la esquina superior derecha
    - Se pueden resetear grupos de elementos
- La escala viene dada por la geometría
-----

## Snap de grid y transformaciones

- Movimiento libre en relación al Grid:
    - Seleccionar el eje en el que queremos mover el objeto + Ctrl
    - En Grid Snapping ( la flechita del icono del imán) puedo configurar las unidades en las que quiero mover el objeto con snap
----

## Snap entre objetos y vértices

- Cómo fijar un objeto con otro. Usar Shader con wireFrame para visualizar las geometrias
    - Para unir dos aristas, con el objeto seleccionado tecla V selecciona un vértice
    - Sin soltar la V arrastro y puedo pegar ese vértice con cualquiera de los vértices del otro objeto
- Dos vertices hacen una arista
- Tres aristas (triángulo) hacen una cara
----
## Herramienta de orientación global

- Para que la cámara vaya al elemento seleccionado doble clic en Herarchy. También serviría con la tecla F
- Para orientarme tengo el gizmo de la parte superior izquierda
    - Es interactiva, yo puedo clicar en el norte y me da una visión desde la parte superior
    - Me da una vista rápida de los laterales, superior y frontal
    - Si clico en el cuadrado del medio me da una vista ortográfica (sin perspectiva)
        - Desde una vista superior sin perspectiva puedo ver cada cosa donde coincide con el grid
    - Puedo bloquear la vista con el candado para que no rote
----

## Herramienta de transformación local

- Está la dirección global y la dirección local de los objetos
    - La global es la común a todos los objetos, mover los objetos en la escena según el eje X Y Z global
    - Si yo roto el objeto y lo muevo globalmente, seguirá el eje pero no en la dirección que está rotado el objeto.
        - Para que vaya en la dirección de la rotación debo moverlo de manera local. Lo cambio en el segundo icono de la parte superior izquierda
- Con la rotación también pasa
- La escala siempre es en la dirección local, así que en la global también.
