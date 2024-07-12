# UI CANVAS

## Parte I

- La UI sirvepara 3D y 2D, 2D para el ejemplo
- La pantalla de Game, si la tengo en Free Aspect, la cámara tomará la medida de la pantalla Game
- Quiero poner un botón ( de inicio de juego, por ejemplo)
    - Menú GameObjects/UI
        - Creo Image: la imagen de UI es gigantesca y la veo en la pantalla Game pequeña
        - Cuando creo un componente UI, Unity crea el componente Canvas automáticamente
            - Canvas es todo lo que va a contener los elementos de la UI
            - Todo elemento de la UI es hijo del Canvas
            - Canvas es la base de todo el UI
            - Unity agrega como hijos del Canvas a los objetos UI automáticamente
            - El Canvas y todo los elementos de la UI tienen (en lugar del Transform) el Rec Transform
                - Tiene algunos parámetros más que el Transform
            - El primer componente de Canvas es el Canvas
                - En el primer campo, Render Mode, aparece por defecto **Screen Space Overlay**
                - Siempre que esté en este modo se va a ver por encima de todo lo que haya en la escena y al tamaño completo de lo que tenga en la cámara
                - El Canvas se adapta al tamaño de la cámara. Si la pantalla Game está en Free Aspect, se ajustará a la pantalla de Game
                - Este modo tiene un prámetro, Pixel Perfect: si lo selecciono, dependiendo del tamño de la cam ajustará el pixel correctamente. No siempre funciona del todo
                - Más opciones de Render Mode son:
                    - Screen Space Camera: me pide que cámara quiero yo que se renderice esta interface
                        - Adapta el Canvas a una cámara específica
                        - tengo el parámetro Playing distance para alejar o acercar la UI
                    - World Space: siempre se va a ver del tamaño que la cámara que esté usando
                        - Me habilita las opciones del Rec Transform. 
                        - Le puedo ajustar el tamaño y posicionarlo
                        - Me pregunta sobre qué cámara quiero trabajar estos eventos con Event Camera
                        - tengo el Sort in Layer y Order in Layer
        - También crea el componente Canvas Scaler
            - Cómo quiero que se escale según se ajuste o no esta UI
                - Constant Pixel Size: que los elementos del Canvas siempre se mantengan con su tamaño de pixel constante. Toma de referencia 100 Pixeles por unidad
                - Scale Screen Size: los elementos van ajustando el tamaño con respecto a la cámara ( y el canvas ). Se autoajusta
                - Constant Physical Size: avanzado
            -  Reference...:Puedo pasarle que resolución de referencia. Si voy a trabajar con una salida de 1280x700 se lo paso ahi
            - Screen Match Mode: cómo voy a decidir que se ajusten estos elementos a partir de la referencia que le doy y el tipo de escala
                - Si estoy en horizontal le diré que priorice el escalado de las imagenes con el ancho y no el alto
                - Lo dejo en width hasta que me de problemas de momento
        - Canvas (Script)
            - Graphic Ray Caster: me permite decirle al Canvas si quiero que sea interactivo o no 
            - tengo máscaras de bloqueo para bloquear algún objeto
- De momento lo más importante es el tipo de renderizado y el tipo de escalado
- Screen Space Overlay suamdo al Scale Screen Size es el que se usará si se quiere que se adpate a todos los dispositivos móviles
- El orden de los elementos que coloco en el Canvas es jerárquico, se superponen a medida que los coloco
- Podemos tener más de un Canvas, no hace falta quie se llame Canvas
----

## UI Rect Transform

- Creo una imagen GameObject/UI/Image
- En el componente Image en Source le añado algún asset que haya importado como Sprite
- Estoy trabajando con Screen Space Overlay y Scale with Screen Size en el Canvas Scaler
- Lo más cómo es trabajar con rec tool ( la última )
- Cuando lo desplazo por el Canvas con esta herramienta me muestra unas coordenadas de posición
    - Estas posiciones están relacionadas con x, y, z y la altura y anchura del elemento relacionado al Canvas
    - Con la UI puedo cambiar directamente el pivote desde la pantalla de Scene con la Rec Tool y cambiandolo a pivote
    - Las lineas de punto son los puntos de anclaje
        - Si yo dejo la imagen en una esquina y cambio el tamaño del canvas no se queda fijado en la esquina
        - Para eso estan los anchors
    - Hay una cruceta en el centro, es el punto de anclaje, la puedo mover para usarlo como punto de anclaje
    - Cada elemento tiene su cruceta en el medio del canvas para su punto de anclaje
    - Si se queda ene el centro, el centro del botón siempre estará relacionado con el punto de anclaje central
    - Si lo coloco en la esquina, ese elemento quedará anclado a la esquina
    - Los puntos de anclaje los trabja en porcentajes

-------

## Imagen UI

- Imagen es muy parecido al componente de Sprite solo que responde a las propiedades de la UI
- Viene con un componente llamado Imagen
    - Source Image: puedo colocar cualquier Sprite
        - en el botón de la derecha puedo elegir las imagenes predeterminadas que tienen las imágenes en Unity
        - Puedo elegir la blanca y deformarla hasta un rectangulo apaisado
        - Si vuelvo a incluir el Sprite y le digo **Preserve Aspect**, la zona activa sigue siendo el rectángulo apaisado, pero veo la imagen del Sprite sin deformar
        - Da igaul el tamaño que yo agrande o achique, siempre me va a mantener el aspecto del Sprite
    - Image Type: 
        - Simple: la imagen tal cual 
        - Sliced: pide trabajar con los sliced del Sprite
        - Tiled: rellena con una copia del elemento horizontalmente. Se suele usar como fondo, anclándolo a cada esquina  
        - Filled: abre otras opciones para ajustar que tipo de rellenado quiero. Avanzado
        - Set Native Sized vuelve la imagen al tamaño original
        - RayCast Target: relacionado con los eventos del ratón y la interactividad. Desmarcada no escucha los eventos del ratón
        - Color: puedo tintar la imagen y trabajar las transparencias
----

## Botones UI

- En el componente Rect Transform tengo una cuadrilla donde posicionar el botón
- Además de tener incorporado el componente de imagen que viene con un UI Sprite nativo tiene incorporado el componente botón (Button Script)
    - Transition
        - Color Tint
            - Normal: cuando aparece en pantalla color
            - Highlited: cuando pase por encima color
            - Pressed: cuando lo persione color
            - Disabled: botón desactivado
    - Fade: cuanto quiero que dure la transición, 1s == 1
    - También podría colocarle una imagen al botón 
    - Tengo más tipos de transiciones:
        - Sprite Swap:
            - Sería lo mismo que cambiar de color pero cambiándole de imagen
        - None: ninguna transición
        - Animation: iría coordinado con el control de animaciones 
- Botón viene con un componente de Texto adjuntado
    - Text: el texto que muestra el botón
- El botón viene equipado con un listener OnClick en el inspector
    - Me da la posibilidad de configurar diferentes elementos
    - Le doy al + y me pregunta sobre qué objeto quiero que ocurra algo ( arrastro y suelto desde la jerarquía )
        - Si despliego el menú My Function aparecen varias opciones de cada uno de los componentes del GameObject
        - Puedo activar y desactivar la función correspondiente
    - Si el GameObject que he arrastrado tuviera un Script, yo podría acceder a él desde el OnClick
----

## UI Textos

- Tiene un campo de texto dónde escribir
    - Todas las ocpiones de los componentes están disponibles para acceder por código, esta noe s una excepción
    - El texto que supere el tamaño de la caja no se va a ver
- Tengo la fuente, el Font Style, Font Size, el espaciado..
    - Para trabajar con otra tipografía hay que importarla
    - Rich Text: activado permite caracteres especiales y emoticonos
- Tengo opciones de párrafo
    - Alinearlo con respecto al centro de la caja
    - Align By Geometry: alinear respecto a la geometría
    - Horizontal/Vertical Overflow
    - Best Fit: relacionado con el Font Size. Intenta acomodar toda la caja de texto al tamaño del Game Object. Útil para textos dinámicos
    - Color
    - Material
    - RayCast Target: enabled puede recibir eventos
----

## Paneles UI

- GameObject/UI/Panel
- El panel por defecto cubre todo el tamaño del canvas y viene con un componente de Image
    - Puedo remover este componente de imagen y meterle hijos en la jerarquía para hacer grupos de GameObjects
    - Puedo agregarle cualquiera de los componentes de Layout a estos objetos
        - Add Component (buscar por Layout) al Panel padre
            - Grid Layout Component. donde empieza, ajustar x, y, etc
            - Horizontal Layout: automaticamente se van ajustando los botones al tamaño del panel
            - Recuerda usar los anclajes!
- Los paneles permiten trabajar con componentes de Layout y agrupar objetos para distribuirlos parejos en la escena
---

## Eventos y Triggers UI

- Se pueden agregar a cualquier elemento de la UI, no solo los botones
- El Canvas crea automáticamente el GameObject EventSystem
    - Se encarga de a través de sus componentes captuarr los eventos de la pantalla de Game: ratón, pantalla táctil, etc
- Hay otro en Component/Event/Touch Input Module (captura los eventos táctiles)
    - Lo colocaría en el Event System
- OnClick viene con el evento Button pero hay más
- Por ejemplo quiero que cuando pase por encima desaparezca la imagen
    - Tengo un componente que se llama **Event Trigger**
        - Add New Event Type, selecciono **Pointer Enter**
        - Le agrego un evento con el +
        - Arrastro el componente de la imagen desde la jerarquía
        - En My Function/Game Object/Set Active (bool)
            - Lo desmarco para que cuando pase por encima ( **sin hacer clic** ) desactive la imagen
        - Funciona con textos, con imagenes 
- Para recibir eventos tien que estar activado el Ray Cast Target del componente, en este caso Imagen
----
