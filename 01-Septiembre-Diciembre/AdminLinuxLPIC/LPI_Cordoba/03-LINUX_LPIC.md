# 03 LINUX LPIC - Gestión de procesos

- Los programascuando se ejecutan se instancian en un proceso
- Cuando ejecutamos un programa, se carga, se crea un mapa en la  memoria RAM y se ejecuta; el nucleo del SO, a través de su planificador le da cierto tiempo de ejecución a ese proceso dentro del procesador ye l procesador hace intrucción por instrucción ejecutando ese binario
- Un proceso es la ejecución de la instancia de un programa, PID es el número único que identifica ese proceso
- Cada proceso es una instancia única e irrepetible
- Hay una planificador de procesos, que adminsitra el estado de ejecución de los procesos
  - Es un módulo del nucleo linux que administra las colas de los procesos disponibles para pasárselos al procesador 
  - Por ejemplo, un Pentium100 que tenia un procesador de un solo núcleo y podias tener varias ventanas abiertas, es porque el planificador de procesos va entrando y sacando el proceso para introducir el requerido a tal velocidad que aparenta ser multi-tarea pero que va
  - Una sola aplicación a la vez dentro de cada núcleo
- También hay distintas prioridades 
  - De usuario y de real-tine (RT)
  - Priority y Nice
- Procesador de un nucleo solo puede correr un proceso
------

## Comando ps

> ps fax

- En la columna de estado todos tienen S, Ss, Ssl
- Tienen su significado:
  - D: espera ininterrumpible (IO)
  - R: corriendo (Running)
  - S: espera interrumpible (esperando evento)
  - T: Detenido (Stopped)
  - Z: Zombie (muerto vivo). Errores de programación normalmente. 
  - I: Hilo del nucleo disponible
  - t: detenido por el debugger
- s minúscula significa lider de sesion ( una consola bash) porque puede generar otros procesos
- El simbolo + significa en primer plano
- l es multihilo
- N es baja prioridad
- < significa alta prioridad
- L tiene páginas de memoria ocupadas y puede bloquearlas
-----

## Prioridades de procesos: conceptos

- ¿Como sabe el planificador de procesos a quien darle paso al procesador?
- Linux mantiene una lista de prioridades. Cuanto mas pequeño sea el número más prioridad tiene
- Hay prioridades de nivel de usuario: las que puede administrar el propio usuario. Van del 100-139
- Las prioridades de tiempo real solo las puede gestionar el sistema, van del 0-99
- Las prioridades a nivel de usuario se cuentan del 0 al 39 por las herramientas del sistema
- Nice es una prioridad dinámica que viene a ser lo mismo, solo que el planificador las trata diferentes
- Linux gestiona los procesos en una cola de procesos activa.
- Los va a ir planificando en un nucleo en base a prioridad alta. El primer proceso va a tener un 20
- Un proceso de baja prioridad (39) o lo que es lo mismo un Nice +19
- Nice es una prioridad manipulable por el usuario, Nice = 0 es una prioridad 20
- El nucleo no siempre va a mantener la prioridad descrita por el usuario, pues necesita modificarla para ir sumando ciertos objetivos
- Lo mismo con procesos de prioridad alta que consumen muchos recursos
- El planificador penalizará o dará bonus según la prioridad para que todos los procesos entrene n el núcleo
- Cuando se inicia un proceso por el usuario lo normal es que tenga una prioridad Nice de 0
- Entonces tendrá una prioridad 20 + NICE
- Una vez que se ejecute volverá a este valor de prioridad
------

## htop

- Columna PR de priority, N (prioridad dinámica donde 0 equivale a 20 de priority) de Nice
- **El planificador de procesos y las prioridades**:
  - El planificador aplica bonus a aquellos procesos con menor prioridad para que tengan opción de entrar en el procesador, y penaliza a aquellos con alta prioridad para que no monopolicen el núcleo
  - Hay dos comandios útiles: nice (permite ejecutar una aplicacion con una prioridad modificada) y renice(nos permite cambiar la prioridad real de un proceso que ya esta en ejecución)
- +19 de Nice es la prioridad menor que podemos darle y +39 es la prioridad más baja

> nice -n +10 yes 

- **cambiando prioridades de los procesos**
- Para cambiar la prioridad de los procesos en ejecución puedo usar el PID del proceso en ejecución

> sudo renice -n +5 3235

- Puedo cambiar la prioridad desde htop también con F7 y F8 (ejecutando htop con sudo)
- top es menos amigable que htop pero disponible en todas las distros
-----

## Señales y kill

- Una señal es un evento asíncrono identificado por algún numero o singularidad.
- Todos los procesos son propensos a recibir señales
- kill, de la biblioteca de C envía una señal para matar procesos
- **kill -l** (l de list) vamos a poder listar todas las señales disponibles en el sistema
- El proceso receptor de la señal puede realizar la acción por defecto para la señal, iniciar una rutina especifica para esa señal o ignorar la señal
- Ctrl + c envia una señal al proceso para terminar (SIGINT)
- Sería lo mismo  escribir kill -STOP 23426 (el PID)
- Si escribo el comando yes y desde otra terminal miro el numero de proceso con ps fax, puedo matarlo con

> kill -TERM 18292

- Term ha detenido el proceso de yes y libera todo lo asociado
- Con kill -l veo que SIGTERM es el número 15. Podría haberlo escrito así
- term (la número 15) pide al proceso terminarse, podría tener programado ejecutar una rutina al recibir esta señal. esto hace que termine correctamente
- Si la señal no responde entonces si que hay que usar kill (la número 9)
> kill -15 PID 2973

- Para filtrar y ver el proceso y su PID puedo usar *ps fax | grep yes*. para filtrar los resultados que sean yes
- kill PID usa la señal número 15 (term)

> kill 97346

- Es recomendable usar TERM antes que kill
- Hay otras señales como SIGALARM, es un clock que hará sonar una alarma (hay que programarlo)
- SIGHUP obliga a recargar su configuración
- SIGPIPE para las tuberías
- SIGCHILD para los procesos hijos
- Para matar todos los procesos

> kill all 
----

## jobs en primero y segundo plano

- Si hay un + en el status del proceso es que esta en primer plano
- foreground (primer plano) y background (segundo plano) 
- Se pueden enviar procesos al segundo plano y gestionarlos mediante señales
- Con & al final hago que la tarea pase al segundo plano

> sleep 100 &

- Me devuelve un PID y un número de tarea
- Puedo buscar el proceso con ps fax | grep sleep
- Con jobs puedo ver todas las tareas que he iniciad, incluidas las que hay en segundo plano

> jobs

- Con fg de foreground puedo traer los procesos al primer plano

> fg

- Para llevarlo al backgorund uso bg

> bg

- La señal SIGCONT hace que el proceso se reactive si está detenido

> kill -CONT 87236

- Puedo usar -STOP para detenerlo
----

## Procesos independientes de la shell

- Para ejecutar un proceso que no muera al cerrar la terminal (un deaemon, un server) se puede con el comando nohup

> nohup yes 

- La salida se escribe en nohup.out del directorio actual


