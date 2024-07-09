# 01 LINUX LPIC

## Software libre y sowftware privativo

- Imagina una receta de cocina
- Sigues un algorritmo (unsa serie de pasos) para obtener una torta
- El **código fuente** es el código, la sintaxis que se usa para crear una app
- Este código una vez interpretado o compilado nos dará la aplicación
- El software cerrado (o privativo) no te da el código fuente (véase Windows)
  - Restringe tu libertad sobre la app
  - No poder dispone del código fuente, es no disponer de la receta de la torta
    - Esto puede generar monopolios, faltas de honestidad, etc
  ----

## Libertades de Software

- Tenemos
  - **FSF** - Free Software Foundation: nuclea todo el movimiento. Dispone de documentación y las guías de software libre
  - **Proyecto GNU** - gnu.org - Es el proyecto de sistema operativo libre. Es el centro del movimiento GNU/Linux, cuyo kernel es Linux pero el SO puede usar otros kernels
  - **Licencias de software GPL** - GPL - General Public License. Es la licencnia de software por excelencia para publicar software libre
  - También está la licencia **open source** que se centran en la funcionalidad, o en las capacidades prácticas de disponer del código fuente y no tanto las libertades en si misma
- Todo software libre debe cumplir **4 libertades**
  - Libertad 0: Uso. usar el programa con cualquier propósito.
  - Libertad 1: Estudio. Estudiar cómo funciona el programa y publicar las mejoras
  - Libertad 2: Mejora. mejorar el programa y publicar las mejoras
  - Libertad 3 : Distribución. Distribuir copias del programa para ayudar a otros
------

## Que es GNU/LINUX

- SO Libre. Free software. Free de libre, no gratuito
- Gratis en la mayoría de casos
- No es necesario pagar licencias ( en la mayoría de los casos )
- Podemos usarlo y compartirlo
----

## Que es un sistema operativo

- Es un programa o conunto de programas que gestionan los recursos de hardware de un ordenador
- El kernel interactua con el hardware  y el SO interactúa con el kernel y nos da acceso. Sobre el SO tenemos las apps
- Para la gestión de procesos, el SO se encarga de planificar su ejecución en uno o más cores( o núcleos ) del microprocesador
- La gestión de la memória se trabaja de forma fragmentada y paginada en el caso de Linux
- Administra la gestión de I/O
- Gestiona el almacenamientoç
- Gestiona las comunicaciones

-----

## Clasificación de los sistemas operativos

- Según disponiblidad código fuente (abiertos/cerrados)
- Según su coste y soporte (comerciales/ no comerciales)
- Según la gestión de procesos (Multitarea/Monotarea)
- Según la gestión de usuarios (Multioususario/Monousuario)
- Según la gestión de procesadores (Multiproceso/MonoProceso)
- Según la arquitectura del núcleo (Monolítico/ Microkernel / Híbridos)
  - GNU/Linux es monolítico modular, corre todo conjuntamente desde el espacio del cucleo junto a los drivers, controladores y demás.
  - Microkernel, es el nucleo corriendo en un espacio muy pequeño (procesos, memoria) que no incluye drivers y controladores. 
  - Híbridos interactuan como cliente servidor con un kernel dividio en varias etapas de acceso al hardware. Windows es un ejemplo
    - Tenemos una capa donde un microkernel corre en el espacio del nucleo hace sus procesos y se comunica con otra capa donde estan controladores y servicios, y desde otra capa las aplicaciones acuden/consultan esos servicios
------

## Arquitectura de GNU/Linux

- Hardware
- Núcleo: software que administar los recursos de hardware a travñes de controladores
- Aplicaciones Base GNU (SO básico creado por Stallman) con aplicaciones de usuario que se pueden instalar, y SysCall (permite programar entradas al núcleo/kernel)
- Shell Gráfica: entorno gráfico con ratón, panel, ventanas, escritorios, y Shell CLI: permite hacer todo a través de comandos
----

## Que son las distribuciones de GNU/Linux

- Sistemas GNU/Linux: es un empaquetado de aplicaciones con un objetivo específico
- Para servidores de red, para usuarios nuevos, para estaciones de trabajo, para auditorias de seguridad, etc
- Hay distribuciones libres y otras comerciales
----

## Sistema de archivos jerárquico virtual

- Podemos ir subdividiendo los directorios para organizar los archivos
- En GNU/Linux todo está dentro del directorio raíz, solo hay uno para todo el sistema operativo
- Los medios extraibles como pendrives, impresoras, se ven como directorios con archivos del sistemaç+
  - Estos son virtuales, son formas de modular perioféricos, por ejemplo, para poderlos administrar
- Todo en Linux es un archivo
  - Diospositivos de almacenamiento
  - Mouse
  - terminales
  - Lectoras CD/DVD
  - Memorias USB
- VFS - Virtual File System
- Directroio raíz, o Root Directory
- /para separar directorios y subdirectorios
- Estructura de directorios común a casi todas las distros
- C/Usuarios ... /home/usuario
----

## Algunos directorios importantes

- / : direcotiro raíz
- /boot : imagen del kernel, información de arranque
- /dev : dispositivos. Tenemos archivos tty son terminales, sda son particiones de un disco, stdin es una entrada standard (terminal)
- /home : directorios de los usuarios comunes
- /media : puntos de montaje para medios extraíbles
- /root : directorio home del superusuario
- /etc : directorio de archivos de configuración
- /bin -/sbin : binarios ejecutables (compilados generalmente en C)
- Con **ls /** veo los directorios que hay en la raíz
-----

## Dispositivos del sistema

- Todos los dispositivos de hardware se representan como un archivo
- Vamos a ver que hay en **/dev** con ls
- En la primera columna de la parte de los permisos empezando por la derecha, veremos una letra. Principalmente en /dev hay tres tipos
  - c : dispositivo de caracter. Podemos interactuar via caracteres, como las terminales de comando tty. En /dev/pts veo las terminales activas
    - Con el comando tty veo la terminal en la que estoy trabajando
    - En /dev/pts son pseudoterminales, no como con las que accedemos con ALT+F1. Son emulaciones dentro de un entorno grñfico
    - Se usan para levantar terminales remotas por ssh
  - b: dispositivos de trasnferencia de bloques. Discos, particiones, sda, sda1, sda2, sdb
- En **/dev/disk** tenemos algunos alias y enlaces simbólicos para estos dispositivos de almacenamiento
  - Tengo by-id, by-partuuid, by-path, etc
  - Con **ls -l /dev/disk/by-id/** encontraré principalmente los sda (de almacenamiento)
- En /dev tenemos **stdin stdout stderr**, enlaces simbolicos a /proc
  - Dispositivos de entrada y salida y error standard. Son los dispositivos usados por cualquier proceso
- **/dev/proc** hace referencia a un sistema de archivos virtual, muchas veces llamado /proc fs
  - Son archivos que no existen en el SO, son cargados en memoria en tiempo de ejecución
  - Hacen referencia a procesos
- Con el comando **mount** veo /proc con archivos de tipo proc
- Sientro en /proc hay un montón de directorios con un número como nombre
  - Ese número hace referencia a el process ID. Cada proceso tiene un directorio (por lo general) 
- Pongamos que estoy trabajando con la terminal bash, puedo poner en la terminal
- Uso **ps fax para listar los procesos del sistema**

> ps fax|grep bash

- Veo que bash tiene el número de proceso 18523
- Puedo ir a /proc/18523 y dentro tendré info del proceso bash que corre la terminal
- El directorio fd tiene los directorios **0 1 2 255**
- Si hacemos un ls -l veremos que apuntan todos a /dev/pts/3
- El archivo cmdline en /proc/18523/cmdline, con cat puedo ver que tiene la palabra bash^@
- Para ver el ejecutable puedo usar file para ver el enlace simbólico con exe

> file /proc/18523/exe

- Me dice que /proc/18523/exxe symbolic link to /usr/bin/bash
- Puedo verlo de otra manera con 

> ls -l /proc/18523/exe

- Hay otro archivo interesante que es **cwd**

> ls -l /proc/18523/cwd

- Es un directorio que apunta al directorio actual de trabajo de un proceso
- Todos los procesos trabajan en algún directorio del sistema. En este caso bash trabaja en el home/usuario

> pwd

- Con **pwd** veo mi directorio actual de trabajo
  - Las rutas relativas cuando cree un archivo nuevo se crearán en ese directorio
- Si yo ahora desde la consola **me muevo al directorio /etc** y hago un ls -l /proc/18523/cwd **me dirá que apunta a /etc**
- Porque es el directorio local de trabajo de ese binario en ese momento
- Otro archivo interesante es status+

> ls -l /proc/18523/status

- Se puede ver el estado del proceso actual Status: S (slepping), un estado que asigna el planificador de procesos del sistema
  - Sleeping significa que el proceso no se está ejecutando en el núcleo de la pc, si no que espera o un ciclo de procesamiento o una operación de entrada y salida como puede ser un acceso a disco
- Puedo ver el PID (process ID) y el PPID (PID del proceso padre)
- En el archivo limits de un proceso puedo ver los limites del proceso

> ls -l /proc/18523/limits

- Tenemos Soft Limit (valor mínimo) y Hard Limit (valor máximo)
- El admin recibirá un aviso si se acerca al Hard Limit
- Tenemos campso como lockedmemory, msgqueues (colas)... se puede limitar su tamaño
- Fuera de los directroios con nombres de número encontramos **/proc/filesystems**, por lo tanto válido para todos los procesos
- Son todos los sistemas de archivos soportados por el SO
- **/proc/dma** almacena los accesos directos a memoria
- Hay otros directorios como **irq** para las interrupciones de hardware
- **sys** que tiene otras características del sistema, como info de networking, que se configura tocando los archivos que aquí se encuentran
--------

## Entendiendo la terminal

- Hay varios tipos: bash (por defecto), Sh, Csh, Dash, etc
- Partes del prompt Bash
- migue@compu:/tmp$
- migue es el usuario, compu hace referencia al nombre del equipo, tmp es el directorio actual, con el separador $ a la parte activa del prompt donde introducir comandos 
- Si observamos :~$ implica que es el directorio home (home/migue)
- Si en lugar de $ tengo de separador # implica que soy root
-----

## Sintaxis de los comandos

- Por ejemplo 

> ls -lhtr --all /tmp /home

- Estamos mostrando el contenido de /tmp y /home, incluso los archivos ocultos con (--all), lo mostramos en formato log (l), es decir extendido,-h es para que se muestre el tamaño de forma amigable, -t  es para que se muestre en orden temporal y -r es de reverse para que ese orden se muestre invertido
- ls es el comando, -lhtr --all son las opciones y /tmp /home son los argumentos
- Con el comando -h obtengo la ayuda
- También puedo usar man
  
> man ls
----

## Conociendo el hardware del sistema

- 




