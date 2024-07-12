## PRACTICA 2D

- Abro en GIMP la imagen para saber el tamaño
- En este caso se le pidió el modelo en 4/3 para salir en todas las plataformas movil (incluido IPad)
- Es una imagen de 2048x1536 (el doble de 1024 x 768)
- 72 pixeles por pulgada ( todas las pnatallas digitales la resolución es esto)
- El IpadPro se mueve más o menos en estos tamaños
- Sabiendo que el tamaño está correcto, una resolución bastante amplia de Pixeles
- Dependiendo del diseño, si está en 16:9 voy a tener que sacrificar un poco los extremos de la pantalla
    - Lo que sea que quiero mostrar debo asegurarme de que está en la "area de seguridad"
- Puedo probar los formatos desde el editor de imagen GIMP
- Puedo ver por capas cada elemento
----

## Preparando el Atlas

- Elijo el tamaño en potencia de 2.
- Puedo trabajar con un nuemro grande 4096x4096 y luego achicarlo
    - Siempre será mejor que de chico a grande porquepierdo calidad
    - Puedo ir dejando los sprites desde abajo y luego partir el lienzo por la mitad si me sobra mucho espacio
- Creo la capa layer del background, lo pinto de rojo para ver si me queda alguna diferencia de color, blanco, imperfecciones, me permite hacer un buen contraste. Luego lo transformo a Alpha
    - Puedo seleccionar los espacios que veo en blanco en contraste con el fondo rojo y borrarlo
----

## Recortando Sprites del Atlas

- Puedo usar Ctrl+ D para copiar el recorte si tengo dos objetos del mismo tamaño
- Recordar tener el modo Multiple antes de abrir el Sprite Editor
----

## Resolución

- En la ventana de Game puedo poner la resolución, Full HD, por ejemplo
- Puedo abrir y ajustar el tamaño de dos ventanas de Game y en una tener la resolución del Iphone y en otra del Ipad y ponerlas dónde yo quiera, en el lateral
- Incluso puedo poner la imagen de referencia con una ventana flotante, colocarla debajo de las dos pantallas de Game
    - De esta manera visualizo con la referencia y la pantalla de Game el tamaño de los Sprites que meto en escena 
- Para escalar a más pequeño puedo ponerle más pixels per unit en el inspector del Atlas padre ( y me cambia todos los Sprites)
- También puedo trabajar el Size de la Main Cam
- En Layers/Edit Layers, Sort Layers (añado los Layers: fondo, suelo, textos, elementos graficos, personajes, etc)
    - Los selecciono en Sorting Layer por su nombre
    - Luego puedo establecer el orden dentro del Layer con Order in Layer
    - Si tengo 3 nubes puedo ponerlas en el Sort in Layer: Fondo
        - En Order in Layer: 1 para la primera nube, el 2 para la segunda, etc
----

## Colocando los personajes con jerarquías

- Creo un GameObject vacío en el 0,0,0
- Traigo los elementos a la jerarquía
- Estructuro el orden en el Layer Personajes que he creado con Order in Layer: 1,2, -1, etc según se vean por encima o por debajo de cada cosa ( los ojos (1) encima de la cara(0), etc)
