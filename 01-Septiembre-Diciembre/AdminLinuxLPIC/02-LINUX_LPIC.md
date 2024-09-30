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