# 2 Dominando la Jerarquía UNITY

## Herarchy

- Puedo crear un objeto vacío y hacerlo padre de otros objetos.
    - Cuando escalo el padre, o lo muevo, lo roto, el resto se ven afectados de la misma forma
- La jerarquía está pensada para trabajar grupos de objetos. Unity no tiene grupos pero tiene jerarquías (la parte izquierda de la pantalla)
- Otra fórmula para crear jerarquías es seleccionar los objetos, clic derecho en Herarchy y Create Empy Parent
- También puedo seleccionar un objeto, clic derecho Set As Default Parent
    - Si arrastro la geometría a la jerarquía lo añade a la escena, pero si lo arrastro a la escena directamente es hijo de la figura que he seteado como default
    - Cuando he terminado, clic derecho Clear Default Parent
- También puedo crear hijos en lugar de padres
    - Selecciono la figura, GameObject -> Create Empty Child
- En cualquiera de las formas, todas las texturas o lo que sea que yo le pase al padre afectarán a los hijos
---

## Moverse dentro de una jerarquía compleja con el teclado

- Con las flechas
- Cuando llego a un padre, con la flecha derecha despliego la jerarquía
- Alt + Shift + flecha derecha abre todas las jerarquías de una jerarquía
- Para cerrar Alt + Shift + flecha izquierda
---

## Control de las jerarquías en la escena

- Unity por defecto pone el manejador (gizmo) de la jerarquía de varios elementos en el centro del grupo
- Puedes cmabiar el centro de pivote desde el icono de center a pivote, y los moverá como centro desde el padre
------

# Práctica

- F2 para renombrar el GameObject en la Herarchy
- Para hacer el negativo de un objeto rotar en Y 180º
- Importante resetear a cero la la position para ubicar bien los elementos
- Se puede copiar y pegar la posición, rotación y escala en el menú de tres puntitos de transformación
- Para poder rotar desde dónde he indicado con el gizmo del Game Object vacío hay que cambiar a PIVOTE y LOCAL
- Para la articulación del codo, crear un object vacío, ponerle la posición del codo con copy past de position
    - Me llevo como hijos el codo, la mano y el antebrazo. Pivoto desde el codo ( el game object vacío commo controlador situado en el codo)
- Importante no usar las escalas para no deformar y no inferir en los hijos
- Uso la jerarquía para agrupar los movimientos, y los gameObject vacíos como controladores, colocándolos en los puntos de rotación

## Gestión de la cámara GAME

- Para hacer una copia y que no se muestre el original en la pantalla de GAME lo desactivo con el checkbox al lado del nombre del inspector
    - Ocultarlo no lo quita de la pantalla de GAME
- Mejor nunca trabajar con el original, mejor hacer una copia
- Cómo posicionar la cámara de juego?
    - Selecciono la Main Camera y le doy a Ctrl + Shift + F
    - La cámara seleccionará la vista que tienes en la escena
    




