# 02 GIT

## Cambios en los archivos

- La M al lado del archivo (en VSCode) me dice que el archivo ha recibido alguna modificación
- Puedo ver esta modificación con

> git diff nombre_archivo

- Me da el archivo a (anterior a la modificación) y b (posterior a la modificación)
- Cuando hay --- antes de a/nombre_archivo significa que se removieron lineas
- Cuando hay +++ es que se añadieron
- En rojo me dice lo que se removió y en verde lo que se añadió
- Si añadir el archivo al stage o hacer ningún commit los cambios pueden verse con git diff
- Es un poco dificil de leer 
- Tocando el simbolito de git de source control puedo ver los cambios en archivos de izquierda y derecha
- Si intento escribir en el archivo me dice que no puedo. Habría que hacer un reset (porque ya está en el stage), una rama, hay varios pasos, luego se verá
----

## Actualizar mensaje de commit y revertir commits

- Para corregir el mensaje de commit

> git commit --amend -m "Corregir mensaje"

- Pongamos que me doy cuenta que hubo un cambio que quiero que forme parte del commit anterior

> git reset --soft HEAD^

- El reset sirve también para sacar del stage
- Usando el HEAD apunta al último commit, el ^ apunta al último commit antes de este HEAD
- Este HEAD puede sustituirse por el HASH del commit que sea
- Si se trata de dos commit antes puedo usar HEAD^2, 3 ,4 , los que sean
- Ahora puedo hacer un nuevo commit con los cambios y ya no está el commit anterior
- Con el git reset hay pérdida de información, **CUIDADO!**, más aún con el --hard
-----

## Viajes en el tiempo

- Añado los cambios con cada archivo por separado
- Luego añado toda una carpeta
- Uso git commit para cada cambio
- COn --mixed saco todo del stage y los cambios quedan listos para que pueda volverlos a añadir, muy parecido al soft, le4 paso el HASH del commit a cambiar. Es el valor por defecto del reset

> git reset --mixed 03247duh

- Los commits siguientes (si este era el tercero, el segundo y el primero) se borran pero los cambios de estos siguientes se mantienen
- Si no quiero esos cambios de los commits subsiguientes uso **--hard**
- Pongamos que me equivoqué y todo estaba bien

> git reflog

- Con esto veré todo, no solo los commits, todo lo que ha sucedido en orden cornológico
- Para volver a ese punto antes de hacer el git reset --hard uso el HASH con otro git reset --hard
  
> git reset --hard 92837b236

- Usualmente vamos a trabajar en ramas y las vamos fusionando en el main para evitar esto smovimientos
- El main solo debería tener los commits definitivos
-----

## Cambiar el nombre y eliminar archivos mediante GIT

- Para cambiar el nombre, por ejemplo a salvar-mundo
- Podría especificar otro path (es como en linux)

> git mv destruir-mundo.md salvar-mundo.md

- Hago el commit
- Hacer git reset --hard sin especificar nada es lo mismo que git checkout -- .
- Para borrar también puedo usar rm

> git rm archivo.md

- Y hacer el commit
- Hay otras maneras de hacer
- Para cambiar el nombre puedo cambiarlo directamente desde el directorio de archivos desde mi editor de código
- Si hago git s (alias) veré que el archivo anterior aparece con una D roja de DELETE, se perderá toda la historia de cambios de este archivo
- Si hago un git add . cambió la D por R de rename con el nombre anterior y el nombre actual
- Hago el commit 
- Uso el archivo **.gitignore** para ignorar aquellos archivos que no quiero dar seguimiento 
-----


