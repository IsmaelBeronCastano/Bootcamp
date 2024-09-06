# DISEÑO SOSTENIBLE - 02 Kata Juego de la Vida

- Esta kata vendrá bien para practicar código simple
- Es una partida de 0 jugadores
- La máquina juega sola en un sistema llamado autómata celular
- Configuramos un patrón inicial en una matriz, y ejecutando el programa, el sistema evoluciona la matriz a través de generaciones
- Se llama el juego de la vida porque su creador quería replicar el ciclo de la vida
- Representa la vida de la siguiente manera
- Una cuadricula de células, unas estan vivas y otras estan muertas
- Cada célula tiene 8 células vecinas, en horizontal, vertical y en las diagonales
- Este patrón simple puede generar patrones cvomplejos gracias a una regla simple
- Puede ser representado bidimensionalmente pero también por cualquier cosa, un fluido, un cubo tridimensinal...
- Las reglas son
  - Cualquier célula *viva* **con menos de dos vecinos** **muere**, por poca población
  - Cualquier célula *viva* **con más de tres vecinos vivos muere**, por superpoblación
  - Cualquier célula *viva* con dos o tres vecinos vivos sigue viva en la siguiente generación
  - Cualquier célula *muerta* **con exactamente tres vecinos resucita**
- Normalmente las reglas las manda quien hace la kata
------