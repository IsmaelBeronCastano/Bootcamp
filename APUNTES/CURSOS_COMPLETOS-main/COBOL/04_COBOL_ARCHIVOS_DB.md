# 04 COBOL ARCHIVOS

## ARCHIVOS LOGICOS Y FISICOS - BASES DE DATOS I

- En COBOL un archivo es una colección de unidades de información relacionadas dentro de una categoría de datos
- En resumen: un archivo es una base de datos
- Se les llama también archivos de datos
- Dentro de los archivos nos encontramos los registros: {1, "Sergio Rodriguez", 23900, "Madrid", 91492345873}
- Los campos serían el id, Nombre y Apellidos, Saldo, Ciudad, Telefono. Es una parte de la información del registro
- Podemos decir que un archivo son una serie de registros que forman una colección 
- En COBOL **la descripción de un registro de datos se ingresa como una variable de estructura**
- EMPLEADOS-ARCHIVO es mi archivo lógico, que incluye el diseño del registro
- Es buena práctica añadir el prefijo como en BEM para identificar rápidamente los campos a qué colección pertenecen
  - En este caso el prefijo es EMPLEADOS
- El archivo físico es lo que hay debajo de FILE-CONTROL que incluye
  - El nombre del archivo, dónde guarda en disco y cómo se organizará el archivo 
- Todos los datos que introduzca en el archivo se guardarán en empleados.dat
- Los **archivos lógicos** se definen en la **DATA DIVISION**, dentro de **FILE SECTION**
- **FD** es la palabra reservada utilizada para definir el archivo lógico (File Descriptor)
- FD se considera una palabra de **número de nivel especial**
- Se puede colocar la palabra reservada LABEL debajo de la definición FD, pero está obsoleta. Se usaba cuando los sistemas eran con cinta
- Los campos que hay definidos es lo que llamamos registro
- El **archivo físico** se escribe en la **ENVIRONMENT DIVISION** dentro de **FILE-CONTROL**
- Con **SELECT** especificamos el archivo lógico correspondiente al físico
- Se lo asignamos con **ASSIGN** seguido del nombre del archivo físico
- Con **ORGANIZATION IS SEQUENTIAL** estamos especificando que la organización del archivo va a ser secuencial  
    - Cuando busquemos algo lo hará leyendo desde el primer registro hasta que encuentre el que estamos buscando
    - Si se añade un nuevo registro, este se añadirá al final del archivo

~~~cbl
INPUT-OUTPUT SECTION.

FILE-CONTROL.
SELECT OPTIONAL EMPLEADOS-ARCHIVO.
ASSIGN TO "empleados.dat"
ORGANIZATION IS SEQUENTIAL.

DATA DIVISION.
FILE SECTION.
FD EMPLEADOS-ARCHIVO.
    01 EMPLEADOS-REGISTRO.
        05 EMPLEADOS-ID PIC X(6).
        05 EMPLEADOS-NOMBRE PIC X(25).
        05 EMPLEADOS-APELLIDOS PIC X(25).
        05 EMPLEADOS-EDAD PIC X(3).
        05 EMPLEADOS-EDAD PIC X(9).
        05 EMPLEADOS-DIRECCION PIC X(35).
~~~

## OPEN, CLOSE WRITE, EXTENSIONES Y RUTAS - BASES DE DATOS II

- Para utilizar un archivo primero tenemos que especificarle que lo abra con **OPEN**
- El OPEN hay que usarlo en la **PROCEDURE DIVISION**
- Hay **4 tipos** de OPEN
  - **OPEN EXTEND** EMPLEADOS-ARCHIVO, hará que si el archivo lógico existe se abra y los registros pueden ser añadidos al final
    - Si no existiera lo crea, y después de crearlo le añadirá los registros
  - **OPEN I-O** EMPLEADOS-ARCHIVO, si el archivo existe se abre y podemos escribir y leer en él, si no existe producirá un error
    - Si empleados.dat no existe, también producirá un error y el programa no compilará
  - **OPEN INPUT** EMPLEADOS-ARCHIVO, si existe lo abre y podremos leer los registros, si no existe produce un error
  - **OPEN OUTPUT** EMPLEADOS-ARCHIVO, si existe lo reemplaza por uno nuevo, si no existe lo crea y podemos añadir registros
- Para prevenir errores con OPEN I-O y OPEN INPUT podemos usar la palabra **OPTIONAL** **en el SELECT**
- Se puede usar siempre que se quiera pero **OPTIONAL solo es compatible con algunas versiones** de COBOL
- Cuando has abierto un archivo debes cerrarlo con la palabra **CLOSE**

~~~cbl
PROCEDIMIENTO-DE-CIERRE.
CLOSE EMPLEADOS-ARCHIVO.
~~~

- Una vez creado el archivo y abierto, para poder escribir en él debemos usar la palabra **WRITE**

~~~cbl
ESCRIBIR-REGISTRO.
WRITE EMPLEADOS-REGISTRO.
~~~

- Al no ponerle ninguna ruta el empleados.dat se va a grabar en la carpeta por defecto del IDE
- En Preferences/Compiler podemos ver dónde se van a guardar los archivos
- Para especificar una ruta, en Windows funcionaría de esta forma

~~~cbl
ASSIGN TO "g:\empleados.dat"
~~~

- Si utilizo c:\ va a generar un error por un tema de permisos. Si ejecuto el IDE como admin no hay problema
- Se pueden usar otras extensiones para el archivo físico. Por ejemplo para crear un excel usar "empleados.csv"
- O .txt, por ejemplo

~~~cbl
IDENTIFICATION DIVISION.
PROGRAM-ID. CREATE-FILES.
ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.

FILE-CONTROL.
SELECT OPTIONAL EMPLEADOS-ARCHIVO
ASSIGN TO "g:/cobol/empleados.dat"
ORGANIZATION IS LINE SEQUENTIAL.

DATA DIVISION.
FILE SECTION.

FD EMPLEADOS-ARCHIVO.
	01 EMPLEADOS-REGISTRO.
		05 EMPLEADOS-ID PIC X(6).
		05 EMPLEADOS-NOMBRE PIC X(25).
		05 EMPLEADOS-APELLIDOS PIC X(35).
		05 EMPLEADOS-EDAD PIC X(3).
		05 EMPLEADOS-TELEFONO PIC X(9).
		05 EMPLEADOS-DIRECCION PIC X(35).

WORKING-STORAGE SECTION.
	01  IDENTIFICADOR PIC X(36)
			VALUE "Introduce un ID del nuevo empleado: ".
	01  NOMBRE PIC X(33)
			VALUE "Introduce un nombre de empleado: ".
	01  APELLIDOS PIC X(25)
			VALUE "Introduce los apellidos: ".
	01  EDAD PIC X(19)
			VALUE "Introduce la edad: ".
	01  TELEFONO PIC X(33)
			VALUE "Introduce un número de teléfono: ".
	01  DIRECCION PIC X(25)
			VALUE "Introduce una dirección: ".
	01  SI-NO PIC X.
	01  ENTRADA PIC X.

PROCEDURE DIVISION.
MAIN-LOGIC SECTION.
PROGRAM-BEGIN.

PERFORM PROCEDIMIENTO-DE-APERTURA.
MOVE "S" TO SI-NO.
PERFORM AGREGAR-REGISTROS
UNTIL SI-NO = "N".
PERFORM PROCEDIMIENTO-DE-CIERRE.

PROGRAM-DONE.
STOP RUN.

PROCEDIMIENTO-DE-APERTURA.
	OPEN EXTEND EMPLEADOS-ARCHIVO.

PROCEDIMIENTO-DE-CIERRE.
	CLOSE EMPLEADOS-ARCHIVO.

AGREGAR-REGISTROS.
	MOVE "N" TO ENTRADA.
	PERFORM OBTENER-CAMPOS
	UNTIL ENTRADA = "S".
	PERFORM ESCRIBIR-REGISTRO.
	PERFORM REINICIAR.

OBTENER-CAMPOS.
	MOVE SPACE TO EMPLEADOS-REGISTRO.
	DISPLAY IDENTIFICADOR " ? ".
	ACCEPT EMPLEADOS-ID.
	DISPLAY NOMBRE " ? ".
	ACCEPT EMPLEADOS-NOMBRE.
	DISPLAY APELLIDOS " ? ".
	ACCEPT EMPLEADOS-APELLIDOS.
	DISPLAY EDAD " ? ".
	ACCEPT EMPLEADOS-EDAD.
	DISPLAY TELEFONO "?".
	ACCEPT EMPLEADOS-TELEFONO
	DISPLAY DIRECCION.
	ACCEPT EMPLEADOS-DIRECCION.
	PERFORM CONTINUAR.

CONTINUAR.
	MOVE "S" TO ENTRADA.
	IF  EMPLEADOS-NOMBRE = SPACE
	MOVE "N" TO ENTRADA.

ESCRIBIR-REGISTRO.
	WRITE EMPLEADOS-REGISTRO.

REINICIAR.
	DISPLAY "¿Desea almacenar otro registro en la base de datos?".
	ACCEPT SI-NO.
	IF SI-NO = "s"
	MOVE "S" TO SI-NO.
	IF SI-NO NOT = "S"
	MOVE "N" TO SI-NO.

END PROGRAM CREATE-FILES.
~~~

## Leer Registros del Archivo - BASES DE DATOS IV

- Puedo crear un programa que me devuelva los registros de la DB

~~~cbl
       IDENTIFICATION DIVISION.
       PROGRAM-ID. READ-FILES.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.

       FILE-CONTROL.
       SELECT OPTIONAL EMPLEADOS-ARCHIVO
       ASSIGN TO "g:\cobol\empleados.dat"
       ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD EMPLEADOS-ARCHIVO.
       01 EMPLEADOS-REGISTRO.
           05 EMPLEADOS-ID PIC X(6).
           05 EMPLEADOS-NOMBRE PIC X(25).
           05 EMPLEADOS-APELLIDOS PIC X(35).
           05 EMPLEADOS-EDAD PIC X(3).
           05 EMPLEADOS-TELEFONO PIC X(9).
           05 EMPLEADOS-DIRECCION PIC X(35).

       WORKING-STORAGE SECTION.
       01  PRESENTACION.
           05 TEXTO-ID PIC X(3) VALUE "ID:".
           05 MUESTRA-ID PIC X(6).
           05 TEXTO-NOMBRE PIC X(7) VALUE "Nombre:".
           05 MUESTRA-NOMBRE PIC X(15).
           05 TEXTO-APELLIDOS PIC X(10) VALUE "Apellidos:".
           05 MUESTRA-APELLIDOS PIC X(20).
           05 TEXTO-EDAD PIC X(5) VALUE "Edad:".
           05 MUESTRA-EDAD PIC X(3).
           05 TEXTO-TELEFONO PIC X(9) VALUE "Telefono:".
           05 MUESTRA-TELEFONO PIC X(10).
           05 TEXTO-DIRECCION PIC X(10) VALUE "Direccion:".
           05 MUESTRA-DIRECCION PIC X(35).

           01  FIN-DEL-ARCHIVO PIC X.
           01  MAXIMO-REGISTROS PIC 99.
           01  GUARDA-ENTER PIC X.
           PROCEDURE DIVISION.

           EMPIEZA-PROGRAMA.
           PERFORM APERTURA-ARCHIVO.
           MOVE ZEROES TO MAXIMO-REGISTROS.
           MOVE "1" TO FIN-DEL-ARCHIVO.
           PERFORM LEE-SIGUIENTE-REGISTRO.
           PERFORM MUESTRA-REGISTROS
           UNTIL FIN-DEL-ARCHIVO = "0".
           PERFORM CIERRE-ARCHIVO.
           PROGRAM-DONE.
           STOP RUN.

           APERTURA-ARCHIVO.
           OPEN INPUT EMPLEADOS-ARCHIVO.

           CIERRE-ARCHIVO.
           CLOSE EMPLEADOS-ARCHIVO.

           MUESTRA-REGISTROS.
           PERFORM MUESTRA-CAMPOS.
           PERFORM LEE-SIGUIENTE-REGISTRO.

           MUESTRA-CAMPOS.
           IF MAXIMO-REGISTROS = 10
           PERFORM PULSAR-ENTER.
           MOVE EMPLEADOS-ID TO MUESTRA-ID.
           MOVE EMPLEADOS-NOMBRE TO MUESTRA-NOMBRE.
           MOVE EMPLEADOS-APELLIDOS TO MUESTRA-APELLIDOS.
           MOVE EMPLEADOS-EDAD TO MUESTRA-EDAD.
           MOVE EMPLEADOS-TELEFONO TO MUESTRA-TELEFONO.
           MOVE EMPLEADOS-DIRECCION TO MUESTRA-DIRECCION.
           DISPLAY PRESENTACION.
           ADD 1 TO MAXIMO-REGISTROS.

           LEE-SIGUIENTE-REGISTRO.
           READ EMPLEADOS-ARCHIVO NEXT RECORD
           AT END
           MOVE "0" TO FIN-DEL-ARCHIVO.

           PULSAR-ENTER.
           DISPLAY
           "Presione la tecla ENTER para ver la siguiente pagina...".
           ACCEPT GUARDA-ENTER.
           MOVE ZEROES TO MAXIMO-REGISTROS.
~~~

- Para leer el archivo uso **READ**
- **NEXT RECORD** es para que lea uno tras otro. Se tomará por defecto ya que es de forma secuencial como se ha indicado
- Con **AT END** lee hasta el último registro

~~~cbl
LEE-SIGUIENTE-REGISTRO.
    READ EMPLEADOS-ARCHIVO NEXT RECORD
    AT END
    MOVE "0" TO FIN-DEL-ARCHIVO.
~~~

- Mientras el FIN-DEL-ARCHIVO valga 1 se va a seguir ejecutando
- Cuando valga 0 se ejecuta CIERRE-ARCHIVO  y termina la ejecución del programa
- Con este programa leo el archivo entero, no tengo otra
- Veremos como crear archivos indexados para poder leerlos en una secuencia diferente 
- Si quiero consultar los empleados por orden de edad o por id

## CREAR Y LEER ARCHIVOS INDEXADOS  - BASES DE DATOS V

- Hay tres tipos de acceso a archivos que tiene COBOL
  - **SEQUENTIAL**, para leer el siguiente registro hay que ller todos los anteriores
  - **RANDOM** se desplaza directamente al registro que queramos consultar
  - **DYNAMIC** es algo intermedio, puedes usar con él la forma secuencial  o la forma RANDOM (directa)

- Uso el modo **DYNAMIC**
- Uso el **ORGANIZATION IS INDEXED** para indexar el resultado, no secuencialmente
- Especifico la clave primaria con **RECORD KEY IS EMPLEADOS-ID**
  - **RECORD KEY** debe ser un campo numérico que debe ser único para cada registro
- CREATE-INDEXED-FILE.cbl

~~~cbl
IDENTIFICATION DIVISION.
PROGRAM-ID. CAPITULO-27.
ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.
* Archivo físico en modo dinámico.
FILE-CONTROL.
SELECT EMPLEADOS-ARCHIVO
ASSIGN TO "empleados.dat"
ORGANIZATION IS INDEXED
RECORD KEY IS EMPLEADOS-ID
ACCESS MODE IS DYNAMIC.

DATA DIVISION.
FILE SECTION.
* Archivo lógico.
FD EMPLEADOS-ARCHIVO.
01 EMPLEADOS-REGISTRO.
	05 EMPLEADOS-ID PIC 9(6).
	05 EMPLEADOS-NOMBRE PIC X(25).
	05 EMPLEADOS-APELLIDOS PIC X(35).
	05 EMPLEADOS-EDAD PIC 9(3).
	05 EMPLEADOS-TELEFONO PIC X(9).
	05 EMPLEADOS-DIRECCION PIC X(35).

WORKING-STORAGE SECTION.
01  IDENTIFICADOR PIC X(36)
	VALUE "Introduce un ID del nuevo empleado: ".
01  NOMBRE PIC X(33)
	VALUE "Introduce un nombre de empleado: ".
01  APELLIDOS PIC X(25)
	VALUE "Introduce los apellidos: ".
01  EDAD PIC X(19)
	VALUE "Introduce la edad: ".
01  TELEFONO PIC X(33)
	VALUE "Introduce un número de teléfono: ".
01  DIRECCION PIC X(25)
	VALUE "Introduce una dirección: ".

01  SI-NO PIC X.
01  ENTRADA PIC X.
PROCEDURE DIVISION.
MAIN-LOGIC SECTION.
PROGRAM-BEGIN.

PERFORM PROCEDIMIENTO-DE-APERTURA.
MOVE "S" TO SI-NO.
PERFORM AGREGAR-REGISTROS
UNTIL SI-NO = "N".
PERFORM PROCEDIMIENTO-DE-CIERRE.

FINALIZA-PROGRAMA.
STOP RUN.

PROCEDIMIENTO-DE-APERTURA.
OPEN OUTPUT EMPLEADOS-ARCHIVO.

PROCEDIMIENTO-DE-CIERRE.
CLOSE EMPLEADOS-ARCHIVO.

AGREGAR-REGISTROS.
MOVE "N" TO ENTRADA.
PERFORM OBTENER-CAMPOS
UNTIL ENTRADA = "S".
PERFORM ESCRIBIR-REGISTRO.
PERFORM REINICIAR.

OBTENER-CAMPOS.
MOVE SPACE TO EMPLEADOS-REGISTRO.
DISPLAY IDENTIFICADOR.
ACCEPT EMPLEADOS-ID.
DISPLAY NOMBRE.
ACCEPT EMPLEADOS-NOMBRE.
DISPLAY APELLIDOS.
ACCEPT EMPLEADOS-APELLIDOS.
DISPLAY EDAD.
ACCEPT EMPLEADOS-EDAD.
DISPLAY TELEFONO.
ACCEPT EMPLEADOS-TELEFONO
DISPLAY DIRECCION.
ACCEPT EMPLEADOS-DIRECCION.
PERFORM CONTINUAR.

CONTINUAR.
MOVE "S" TO ENTRADA.
IF EMPLEADOS-NOMBRE = SPACE
MOVE "N" TO ENTRADA.

ESCRIBIR-REGISTRO.
WRITE EMPLEADOS-REGISTRO.

REINICIAR.
DISPLAY "¿Desea almacenar otro registro en la base de datos?".
ACCEPT SI-NO.
IF SI-NO = "s"
MOVE "S" TO SI-NO.
IF SI-NO NOT = "S"
MOVE "N" TO SI-NO.

END PROGRAM CAPITULO-27.
~~~

- READ-INDEXED-FILE

~~~cbl
  IDENTIFICATION DIVISION.
  PROGRAM-ID. CAPITULO-27.
  ENVIRONMENT DIVISION.
  INPUT-OUTPUT SECTION.
  FILE-CONTROL.

  SELECT EMPLEADOS-ARCHIVO
  ASSIGN TO "empleados.dat"
  ORGANIZATION IS INDEXED
  RECORD KEY IS EMPLEADOS-ID
  ACCESS MODE IS DYNAMIC.

  DATA DIVISION.
  FILE SECTION.

  FD EMPLEADOS-ARCHIVO.
  01 EMPLEADOS-REGISTRO.
      05 EMPLEADOS-ID PIC 9(6).
      05 EMPLEADOS-NOMBRE PIC X(25).
      05 EMPLEADOS-APELLIDOS PIC X(35).
      05 EMPLEADOS-EDAD PIC 9(3).
      05 EMPLEADOS-TELEFONO PIC X(9).
      05 EMPLEADOS-DIRECCION PIC X(35).

  WORKING-STORAGE SECTION.
  77  LEE-TODO  PIC X.
  
  PROCEDURE DIVISION.
  
  EMPIEZA-PROGRAMA.
  PERFORM PROCEDIMIENTO-DE-APERTURA.
  MOVE "0" TO LEE-TODO.
  PERFORM LEE-SIGUIENTE-REGISTRO.
    IF LEE-TODO = "1"
      DISPLAY "No se encontraron registros en el archivo."
        ELSE
          PERFORM MUESTRA-CAMPOS
          UNTIL LEE-TODO = "1".
          PERFORM PROCEDIMIENTO-DE-CIERRE.
          
          FINALIZA-PROGRAMA.
          STOP RUN.
          
          PROCEDIMIENTO-DE-APERTURA.
          OPEN I-O EMPLEADOS-ARCHIVO.
          
          PROCEDIMIENTO-DE-CIERRE.
          CLOSE EMPLEADOS-ARCHIVO.
          
          MUESTRA-CAMPOS.
          DISPLAY "ID: " EMPLEADOS-ID
        " Nombre: " EMPLEADOS-NOMBRE " Apellidos: "
        EMPLEADOS-APELLIDOS " Edad: " EMPLEADOS-EDAD " Telefono: "
        EMPLEADOS-TELEFONO " Direccion: " EMPLEADOS-DIRECCION.
        
        PERFORM LEE-SIGUIENTE-REGISTRO.
        
        LEE-SIGUIENTE-REGISTRO.
        READ EMPLEADOS-ARCHIVO NEXT RECORD
        AT END MOVE "1" TO LEE-TODO.
  END PROGRAM CAPITULO-27.
~~~

- Es el mismo código que el anterior pero este no es secuencial y el resultado está indexado

## Reutilizar código repetitivo con COPY - BASES DE DATOS VI

- En el programa de creación y de lectura primeros, el FILE-SECTION (y el FD EMPLEAADOS-ARCHIVO) es idéntico
- Va bien tener este código en archivos aparte para no tener que reescribir tanto codigo
- Con **COPY** cargamos el código
- Copio desde debajo de FILE-CONTROL desde el SELECT hasta el ACCESS y lo guardo en un archivo llamado archivo_fisico.cbl
  - En este archivo_fisico.cbl **no tengo el boilerplate** inicial (IDENTIFICATION-DIVISION), solo desde el SELECT hasta el ACCES, porque es lo que se repite en los dos archivos y quiero reutilizar
- Ahora uso la palabra **COPY** y la ruta del archivo donde he guardado el código

~~~cbl
FILE-CONTROL.
COPY "g:\archivo_fisico.cbl".
~~~

## Eliminar registros de archivos indexados - BASES DE DATOS VII

- Si es un archivo indexado no se puede visualizar con el bloc de notas o lo que fuere
- **DELETE-FROM-INDEXED-FILE** me va a ayudar a borrar registros indexados
- **INVALID KEY** sirve para jecutar cierta acción si el registro no existe, se especifica abajo
- Podemos poner **NOT INVALID KEY** para lo contrario
- Con **WITH LOCK** bloqueariamos el archivo por si hubiera más gente interactuando con la DB (en LEE-REGISTRO-EMPLEADO)

> READ EMPLEADOS-ARCHIVO RECORD WITH LOCK

- DELETE-INDEXED-FILE

~~~cbl
IDENTIFICATION DIVISION.
PROGRAM-ID. DELETE-FROM-INDEXED.
ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.

FILE-CONTROL.
*Archivo fisico en modo dinamico.
COPY "PHYSICAL-FILE.cbl".

DATA DIVISION.
FILE SECTION.
*Archivo logico.
COPY "LOGICAL-FILE.cbl".

WORKING-STORAGE SECTION.
77  SI-A-ELIMINAR PIC X.
77  REGISTRO-ENCONTRADO PIC X.
77  CAMPO-EMPLEADOS-ID PIC Z(5).

PROCEDURE DIVISION.

EMPIEZA-PROGRAMA.
OPEN I-O EMPLEADOS-ARCHIVO.
PERFORM OBTENER-REGISTRO-DE-EMPLEADO.
PERFORM ELIMINA-REGISTROS
UNTIL EMPLEADOS-ID = ZEROES.
CLOSE EMPLEADOS-ARCHIVO.
FINALIZA-PROGRAMA.
STOP RUN.

OBTENER-REGISTRO-DE-EMPLEADO.
PERFORM INICIA-REGISTRO-DE-EMPLEADOS.
PERFORM INTRODUCIR-NUMERO-ID-EMPLEADO.
MOVE "N" TO REGISTRO-ENCONTRADO.
PERFORM ENCUENTRA-REGISTRO-EMPLEADO
UNTIL REGISTRO-ENCONTRADO = "S" OR
EMPLEADOS-ID = ZEROES.

INICIA-REGISTRO-DE-EMPLEADOS.
MOVE SPACE TO EMPLEADOS-REGISTRO.
MOVE ZEROES TO EMPLEADOS-ID.

INTRODUCIR-NUMERO-ID-EMPLEADO.
DISPLAY " ".
DISPLAY "Introduce un numero de ID de empleado." .
DISPLAY "Introduce un numero del 1 al 99999".
DISPLAY "Introduce cualquier otra cosa para salir.".
ACCEPT CAMPO-EMPLEADOS-ID.
MOVE CAMPO-EMPLEADOS-ID TO EMPLEADOS-ID.

ENCUENTRA-REGISTRO-EMPLEADO.
PERFORM LEE-REGISTRO-EMPLEADO.
IF REGISTRO-ENCONTRADO = "N"
DISPLAY "No se encontro ningun registro con ese ID."
PERFORM INTRODUCIR-NUMERO-ID-EMPLEADO.

LEE-REGISTRO-EMPLEADO.
MOVE "S" TO REGISTRO-ENCONTRADO.
READ EMPLEADOS-ARCHIVO RECORD
INVALID KEY
MOVE "N" TO REGISTRO-ENCONTRADO.

ELIMINA-REGISTROS.
PERFORM MOSTRAR-TODOS-LOS-CAMPOS.
MOVE "Z" TO SI-A-ELIMINAR.
PERFORM PREGUNTA-ELIMINAR
UNTIL SI-A-ELIMINAR = "S" OR "N".
IF SI-A-ELIMINAR = "S"
PERFORM ELIMINA-REGISTRO.
PERFORM OBTENER-REGISTRO-DE-EMPLEADO.

MOSTRAR-TODOS-LOS-CAMPOS.
DISPLAY " ".
PERFORM MOSTRAR-EMPLEADO-ID.
PERFORM MOSTRAR-EMPLEADO-NOMBRE.
PERFORM MOSTRAR-EMPLEADO-APELLIDOS.
PERFORM MOSTRAR-EMPLEADO-EDAD.
PERFORM MOSTRAR-EMPLEADO-TELEFONO.
PERFORM MOSTRAR-EMPLEADO-DIRECCION.
DISPLAY " ".

MOSTRAR-EMPLEADO-ID.
DISPLAY "ID: " EMPLEADOS-ID.

MOSTRAR-EMPLEADO-NOMBRE.
DISPLAY "NOMBRE: " EMPLEADOS-NOMBRE.

MOSTRAR-EMPLEADO-APELLIDOS.
DISPLAY "APELLIDOS: " EMPLEADOS-APELLIDOS.

MOSTRAR-EMPLEADO-EDAD.
DISPLAY "EDAD: " EMPLEADOS-EDAD.

MOSTRAR-EMPLEADO-TELEFONO.
DISPLAY "TELEFONO: " EMPLEADOS-TELEFONO.

MOSTRAR-EMPLEADO-DIRECCION.
DISPLAY "DIRECCION: " EMPLEADOS-DIRECCION.

PREGUNTA-ELIMINAR.
DISPLAY "SEGURO QUE QUIERES ELIMINAR ESTE REGISTRO (S/N)?".
ACCEPT SI-A-ELIMINAR.
IF SI-A-ELIMINAR= "s"
MOVE "S" TO SI-A-ELIMINAR.
IF SI-A-ELIMINAR= "n"
MOVE "N" TO SI-A-ELIMINAR.
IF SI-A-ELIMINAR NOT = "S" AND
SI-A-ELIMINAR NOT = "N"
DISPLAY "Debes introducir S/N.".

ELIMINA-REGISTRO.
DELETE EMPLEADOS-ARCHIVO RECORD
INVALID KEY
DISPLAY "Error eliminando el registro de empleados.".
~~~

## Problemas con la creación del archivo - BASES DE DATOS VIII

- La DB tiene un fallo en el archivo de crear archivo e introducir registros
- Si dejo de ejecutar el programa y lo vuelvo a ejecutar, me va a borrar todo lo que tenía en el archivo
- Para evitar que pase esto la respuesta está en el **OPEN**
- De los 4 tipos de OPEN, 3 est-an disponibles para los archivos indexados y **EXTEND** no, es para los secuenciales
- **INPUT** solo sirve para leer y si no esta creado el archivo da error
- Con **OUTPUT** puedo leer y escribir, si el archivo no esta creado lo crea, pero si está creado lo borra
- En el modo **I-O** (INPUT-OUTPUT) si el archivo no está creado me va a dar error también 
- La solución es crear un archivo solo de creación del archivo y dejar 
- Dejo el **OPEN I-O EMPLEADOS-ARCHIVO en PROCEDIMIENTO-DE-APERTURA** de CREATE-INDEXED-FILE
- Entonces ahora debo ejecutar primero el programa de creación de archivo para que no de error

- OUTPUT-PHYSICAL.cob

~~~cbl
     IDENTIFICATION DIVISION.
       PROGRAM-ID. OUTPUT-PHYSICAL.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
      *Archivo fisico en modo dinamico.
       FILE-CONTROL.
       COPY "PHYSICAL-FILE.cbl".

       DATA DIVISION.
       FILE SECTION.
      *Archivo logico.
       COPY "LOGICAL-FILE.cbl".
       WORKING-STORAGE SECTION.
       PROCEDURE DIVISION.

       PROCEDIMIENTO-DE-APERTURA.
       OPEN OUTPUT EMPLEADOS-ARCHIVO.

       PROCEDIMIENTO-DE-CIERRE.
       CLOSE EMPLEADOS-ARCHIVO.
       DISPLAY "Se ha creado el archivo correctamente."
            STOP RUN.
       END PROGRAM OUTPUT-PHYSICAL.
~~~

- En COBOL vas a tener que realizar esta tarea para crear archivos porque tiene ciertas limitaciones

## EVALUATES y REDEFINES (FINAL)

- **EVALUATE TRUE** se parece bastante a lo que sería un switch

~~~cbl
IDENTIFICATION DIVISION.
PROGRAM-ID. CAPITULO-31.
DATA DIVISION.
FILE SECTION.
WORKING-STORAGE SECTION.
	77 NUM1 PIC 9(5) VALUE 16.
	77 NUM2 PIC 9(5) VALUE 10.
	77 NUM3 PIC 9(5) VALUE 20.

PROCEDURE DIVISION.

MAIN-PROCEDURE.
	EVALUATE TRUE
	WHEN NUM1 = 5
	COMPUTE NUM1 = NUM1 + NUM2 + NUM3
	DISPLAY NUM1

	WHEN NUM1 = 10
	COMPUTE NUM1 = NUM1 * NUM3
	DISPLAY NUM1

	WHEN NUM1 = 15
	COMPUTE NUM1 = NUM2 - NUM3
	DISPLAY NUM1

	WHEN OTHER
	DISPLAY "VALOR NO CONTEMPLADO."

END-EVALUATE.

STOP RUN.
END PROGRAM CAPITULO-31.
~~~

- **REDEFINES** permite cambiar el tipo de PICTURE y se puede utilizar con cualquier numero de nivel excepto 01
- Por ejemplo podría redefinir NUM1 a string así
- Puedo cargar un número con MOVE en NUMSTR. NUMSTR obtiene el valor de NUM1 por defecto
- Debo usar REDEFINES **debajo de la variable a usar**, si no me dará error

~~~cbl
77 NUM1 PIC 9(3)
77 NUMSTR REDEFINES NUM1 PIC X(7).
~~~

- 

