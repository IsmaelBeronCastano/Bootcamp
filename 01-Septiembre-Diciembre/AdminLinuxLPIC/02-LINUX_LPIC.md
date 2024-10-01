# 02 LINUX LPIC - Consola de comandos

## terminales, pseudoterminales

- Hay dos tipos
  - terminales graficas
  - terminales de texto
    - terminales nativas del sistema (tty)
      - Estan en /dev. Ejemplo /dev/tty0, tty1 ...
  - pseudo-terminales (pts): cuando la app abre una consola de comandos para interactuar
    - tambien en /dev. Ejemplo /dev/pts/pts0, pts1 ...
    - conexiones remotas
  - emuladores de terminal
- Para las opciones del comando tenemos la froma larga y la forma corta. Ej: --name === -n
- Se les puede pasar valores a estas opciones

## Opciones o modificadores

- El guión único sirve para las versiones cortas
- Puedo juntar varias letras

> ls -htl === ls -h -t -l

- l: en formato completo (long)
- h: con tamaños legibles (human)
- t: ordfenado por tiempo (time)
- r: con orden inverso (el último debajo) (reverse)

- Mediante -- puedo pasarle palabras completas
- Normalmente los comanos aceptan las dos opciones (-, --)
- COn ls puedo pasarle el directorio a listar 

> ls /home
> ls -lh /tmp
> ls/usr -lh --all
>
- --all me muestra todos los archivos, incluido los ocultos. Podria ser -a
- El orden de los comandos no influye en el resultado
- Mayúsculas y minúsculas dan resultadois **distintos**
  - En ls -r es reverse, -R es recursive
----

## Comandos básicos

- cd para cambiar de directorio
- cd - para ir al directorio anterior en el que trabajo 
- cd .. para ir al directorio anterior
- ls -l para listar directorios de manera extensa
  - En el formato del resultado de ls la primera letra indica que tipo es
    - l: link simbólico (accesos directos)
    - d: directorio
  - Las letras de permisos son
    - r: read
    - w: write
    - x: execute
    - Se ordenan por usuario dueño, grupo, otros usuarios
  - Seguido el usuario dueño
  - Seguido el grupo al cual pertenece
  - El tamaño en Bytes
  - La fecha de ultima modificación
  - El nombre del elemento
- Para ver los comandos usar **man** ls

> man ls

- Los directorios . y .. están en todos los directorios
- . apunta al directorio actual. por eso cd . me deja en el mismo dirtectorio
    - Se utiliza para rutas relativas, copiar un directorio al directorio actual, usando ./ para indicar el mismo directorio
- .. apunta al directorio anterior 
- Para calcular el tamaño en disco (s para sumarize, h para el formato legible)

> du  -sh /tmp/

- Para ver el tamaño usado del disco
- df -h

- dfc es comando más grafico version de df

> dfc

- history muestra el historial de comandos 

> history

- Puedo ejecutar de nuevo el comando usando su numero en el historia

> !220

- Puedo usar !! para ejecutar el comando anterior (con sudo, por ejemplo)

> du -sh /tmp/ (no me deja porque no tengo permisos)
> sudo !!

- Para trabajar con directorios
- Crear uno

> mkdir nombre_directorio

- Para listar directorios de forma recursiva puedo usar tree

> tree /tmp/

> mkdir -p /tmp/dirA/dirB

- Sin -p no me deja porque dirA no existe
- Para borrar directorio 

> rmdir dirB

Si el directorio contiene uso 

> rmdir -rl d6irA

- Para crear un archivo puedo usar touch

> touch dirA/archivo1

- Para borrar un archivo

> rm dirA/archivo1

- Para leer en froma recursiva los elementos uso -R

> ls -R dirA/

- Para eliminar directorio con contenido puedo usar rm -r

> rm -r dirA/

- Para copiar y mover archivos y directorios
- Para copiar un archivo1 a dirB

> cp archivo1 dirA/dirB

- Puedo renombrarlo 

> cp archivo1 dirA/dirB/archivo_copia

- Para copiar un directorio completo dirA dentro de otro directorio (backup)

> cp -r dirA/ backup

- Para mover los archivos uso mv

> mv dirA/dirB/archivo1 dirA/dirC

- Podemos mover directorios completos, no necesita -r 
  
> mv dirA/  backup/dirA/dirC

- mv también sirve para renombrar archivos

> mv archivo_a_cambiar archivo_nuevo
----

## redirecciones y encadenado de comandos con pipes

- pipes son | (símbolo de tubería)
- Nos permite tomar la salida de un comando y usarlo como entrada del siguiente
- Por ejemplo, tengo una salida muy grande, se lo paso a otro comando que se encargue de paginar como more

> ls -lh /tmp/ | more

- Otra forma es con less

> ls -lh | less

- Con less tengo otras funcioanlidades como buscar contenido. Salgo con Q
- Para filtrar el contenido como solo recibir la quinta columna y la 9ena de la salida de ls uso

> ls -lh /tmp/ | awk '{print $5"\t" $9}'

- Para filtarr por filas las filas que contengan la palabra systemd uso otro pipe y grep

> ls -lh /tmp/ | awk '{print $5"\t" $9}' | grep systemd

- awk es un lenguaje de programación completo
- Para filtrar y quitar la máscara de /24 de las subredes puedo usar cut
- De ip a paso la tuberia a filtrar por inet, de este resultado firltro por inet6 (solo ipv6), con awk indico que imprima la segunda columna
- Con cut -d le indico lo que quiero borrar y f1 es que me muestre la fila 1 con las direcciones

> ip a | grep inet | grep -v inet6 | awk '{print $2}' | cut -d'/' -f1

- Si pongo f2 me mostraría los 24
----

## Redirección de salida standard y error

- Para ver todos los procesos corriendo en el equipo

> ps fax

- En linux todo son archivos
- Me muestra un número de PID (primera columna izquierda)
- Elijo el mismo ps fax que he ejecutado en la terminal bash
- Si busco ese número de PID en /proc me devuelve varios archivos abiertos por ese proceso
- Veo que todos apuntan a otro archivo virtual en este caso /dev/pts/8

> ls /proc/29762/
> ls /proc/29762/fd -l

- Esto me devuelve 0, 1, 2, 255
  - 0 es el flujo de trabajo o file descriptor de la entrada standard
  - 1 es la salida standard
  - 2 es la salida de error
- Al lado se ve -> directorio
- En este caso todos apuntan a /dev/pts/8
- Si yo escribo tty en consola veré que es mi terminal

> tty 

- devuelve /dev/pts/8
- En el modo gráfico vamos a ver emuladoras de terminal corriendo en pseudoterminales pts
- Si quiero almacenar la salida de ip a en un archivo de texto podría hacerlo asi

> ip a > /tmp/salida_ip.txt

- Si quisera guardar el error del comando podría hacerlo asi (donde homesss no existe y devuelve error)

> ls /homessss 2> archivo_errores.txt

- Así redirecciono la salida
- Puedo redireccionar la salida standar y la salida de error en un mismo comando
- El 1 lo puedo omitir

> ls /home/ 1> /tmp/salida 2>&1

- De esta manera, si el comando se ejecuta bien, el archivo salida contendrá la respuesta y si se ejecuta mal también
- De esta manera se sobreescribe el archivo si vuelvo a ejecutar el comando
- Para hacer un append uso >>

> ip a >> /tmp/salida  

- De esta manera irá agregando la salida en el archivo al final de la salida anterior 
- Puedo redireccionar la entrada con < 

> cat << FIN

- Con este comando redirecciono la entrada  yvoy a poder escribir en consola hasta que escriba FIN
- Escrito FIN me muestra el texto que he escrito anteriormente
- En lugar de mostrarlo por pantalla lo redirecciono a una salida

> cat << FIN > /tmp/archivo
------

## Más comandos básicos

- Enviar el listado a un archivo

> ls /home/migue/ > /tmp/listado.txt

- para mostrarlo de forma paginada uso un pipe con more, redireccionando el resultado a more

> cat listado.txt | more

- Tambien me vale less (que tiene más funcionalidades)

> cat listado.txt | less

- Con q salgo
- Puedo usarlos directamente

> more listado.txt

- Para ver las primeras (10) lineas del archivo

> head listado.txt

- Puedoindicar las lineas con -n. Para mostrar las primeras 5 lineas

> head -n5 listado.txt

- Para mostrar las 5 ultimas

> tail -n5 listado.txt

- Con tail -f muestra las últimas 10 lineas del archivo y queda a la escucha de modificaciones
- Para añadir desde otra terminal contenido al archivo puedo usar echo

> exho "texto a agregar" >> /tmp/listado.txt
> tail -f listado.txt

- wc da información del archivo: La cantidad de lineas, cantidad de palabras y cantidad de caracteres

> wc listado.txt

- Para ver la cantidad de lineas

> wc -l listado.txt

- con -w muestra las palabras, -c muestra caracteres
- Para ubicar binarios o archivos con ciertos comandos un comando es which
- ls es un binario, pero imaginemos que no sabemos donde se encuentra ubicado

> which ls

- En general los comandos están en /usr/bin/

- whereis tambien nos muestra informacion de la página de manual, biblioteca

> whereis ls
-----

## El comando find

- find sirve para buscar archivos dentro del disco. Es un comando muy potente
- Tiene varios patrones de búsqueda y opciones que hacer con los resultados
- Uso . para indicar que busque en el mismo directorio en el que estoy
- Busco por nombre, todos los archivos que empiecen por arc

> find . -name 'arc*' 

- Por extension

> find /tmp/ -name '*.ts'

- Para omitir mayúsculas y minúsculas uso el modificador i

> find / -iname '*.Ts'

- Podemos buscar por tipo, por directorio por ejemplo

> find /tmp/ -type d

- f para archivos, l para enlaces simbólicos, b para dispositivos de bloques(almacenamiento), c para dispositivos de caracter, p para pipes
- -size para buscar por tamaño
- Para buscar aquellos que tengan más de 2048Kilobytes, b para bytes, M para megas, G para gigas

> find . -size +2048k

Puedo combinar resultados y buscar archivos que tengan entre 500 megas y 1 giga

> find . -size +500M -size -size -1g 

- exec me permite ejecutar un comando tras la busqueda con find
- Para que muestre el nombre en el archivo uso {} siempre seguido de \;

> find . -size 500k -exec echo "Econtrado {}" \; 

- En lugar de echo puedo usar cualquier otro comando, rm para remover, gzip para comprimir, etc
- Puedo buscar por archivos modificados los ultimos 40 días, por permisos, patrones, **find es muy potente**
------

## grep

- Filtrar con grep. Para filtrar por palabras o patrones (con egrep)
- Para filtrar por la palabra root

> cat listado.txt | grep root

- También se puede usar directamente

> grep root listado.txt

- Para contar la cantidad de lineas que tienen la palabra root uso -c.
- Puedo usar -i para que omita mayúsuclas y minúsculas

> grep -c -i  listado.txt

- -H imprimirá el nombre del archivo en el que encontró la palabra en cuestión -r para buscar recursivamente

> grep -c -i -H -r /tmp/

- Para filtrar por procesos

> ps fax | grep ssh

- Para que omita las filas que contengan la palabra grep

> ps fax | grep ssh| grep -v grep
------

## AWK

- Herramienta compleja que facilita tareas de filtrado y otras operaciones matemáticas
- Podemos incorporar variables, incluso lógica de programación con bucles y condicionales
- Para imprimir la primera fila del resultado del listado

> ls -l | awk '{print $1}'

- Puedo usar un delimitador para separar las columnas por : uso -F

> ls -l | awk -F':' '{print $1}'

- Para mostrar varias columnas

> ls -l | awk '{print $1, $5}'

- Pongamos que hago un ls -l sin la h y quiero dividir la fila $5 de tamaño por 1024 para tenerlo en kylobytes

>ls -l / | awk '{print %5/1024}'

- Puedo añadirle una leyenda

> ls -l / | awk '{print "Tamaño: " %5/1024 "KiB"} '

- $0 es la primera columna $NF nos da el último elemento de una lista

> echo "hola, mundo. que tal" | awk '{print $NF}'  //devuelve tal

- Con $0 muestra la cadena completa, con $1 la primera palabra

> echo "11 22 33" | awk '{total=0; for (i=1; i < =NF, i++) total=+=$i; print total}' //devuelve 66

- Para calcular el promedio

> echo "11 22 33" | awk '{total=0; for (i=1; i < =NF, i++) total=+=$i; print total/NF}' //devuelve 66

- Para mostrar el resultado con un encabezado usamos BEGIN

> ls -l / |  awk 'BEGIN {print "Tamaños de buffer"} {print $9, $5}'

- Para mostrar un footer usar END

> ls -l / |  awk 'BEGIN {print "Tamaños de buffer"} {print $9, $5} END {print "Esto es todo!}'
