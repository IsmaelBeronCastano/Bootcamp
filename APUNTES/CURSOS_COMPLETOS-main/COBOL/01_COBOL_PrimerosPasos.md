# 01 COBOL Primeros Pasos

- Instalar Micro Focus COBOL extension for vscode
  
> https://marketplace.visualstudio.com/items?itemName=Micro-Focus-AMC.mfcobol

- Instalar IDE OpenCobolIDE 

> https://launchpad.net/cobcide/+download

- Creo un archivo en el IDE y aparece esto en el archivo
- Estas lineas son necesarias en todos los programas, el IDE las escribe por ti
- Imprime un hello world

~~~cbl
******************************************************************
* Author:
* Date:
* Purpose:
* Tectonics: cobc
******************************************************************
IDENTIFICATION DIVISION.
PROGRAM-ID. YOUR-PROGRAM-NAME.
DATA DIVISION.
FILE SECTION.
WORKING-STORAGE SECTION.
PROCEDURE DIVISION.
MAIN-PROCEDURE.
    DISPLAY "Hello world"
    STOP RUN.
END PROGRAM YOUR-PROGRAM-NAME.
~~~

## Divisiones de COBOL
### IDENTIFICATION DIVISION

- Todo programa COBOL tiene 4 divisiones. Cada una tiene una función específica
  - IDENTIFICATION DIVISION
    - Es la primera y única división obligatoria
    - LLeva info del programa como el propio nobre, el autor, etc
  - ENVIRONMENT DIVISION
    - Lleva info del entorno: el ordenador que se ha escrito, el ordenador que se va a ejecutar, etc
  - DATA DIVISION
    - Esta es una de las más importantes.
    - No es obligatoria, pero en ella se ponen registros, variables, nombres de campos, etc
  - PROCEDURE DIVISION
    - Es donde disponemos de todos los procesos necesarios para que el programa funcione: verbos, comandos, etc
- Las divisiones estan divididas por secciones
- IDENTIFICATION DIVISION
    - Tenemos dos secciones obligatorias:
      - IDENTIFICATION DIVISION (la que identifica la división)
      - PROGRAM-ID. NOMBRE_PROGRAMA.
    - Cada una de estas secciones acabará con un punto obligatorio. Son parecidos a los punto y coma de los lenguajes modernos
    - Al final, en END PROGRAM. debo poner el mismo nombre que en PROGRAM-ID
- Hay algunas secciones opcionales en IDENTIFICATION DIVISION.
- Estan obsoletas pero no van a producir errores
  - AUTHOR. El nombre del autor
  - INSTALLATION. Sirve para especificar donde esta instalado el programa
  - DATE-WRITTEN. 26/11/2019 La fecha de creación del programa
  - DATE_COMPILED. Fecha de compilación del programa
  - REMARKS. Programa de prueba de Cobol. Comentarios sobre el programa
- Estas últimas ya no se utilizan

### ENVIRONMENT DIVISION

- Se utiliza para especificar datos el entorno físico que vamos a utilizar en el programa
- No es obligatoria
- Se segmenta en dos partes:
  - CONFIGURATION SECTION
  - INPUT-OUTPUT SECTION

~~~cbl
ENVIRONMENT DIVISION.
CONFIGURATION SECTION.
SOURCE-COMPUTER. Ordenador donde se escribió el codigo.
OBJECT-COMPUTER. Ordenador donde se ejecutará el código.
SPECIAL-NAMES. Permite cambiar valores de constantes del lenguaje

INPUT-OUTPUT SECTION.
FILE-CONTROL.
SELECT[OPTIONAL] Nombre del archivo
ASSIGN TO Tipo de dispositivo
ORGANIZATION Tipo de organización
ACCESS MODE IS Modo de acceso al archivo
RECORD KEY IS  Clave de registro
ALTERNATE RECORD KEY IS Claves alternativas del registro
WITH DUPLICATES
STATUS IS Variable de estado del archivo
~~~

### DATA DIVISION

- Es la tercera división de aparición en los programas COBOL
- Es dónde se declaran los datos del programa como por ejemplo las variables
- Se segmenta en 3 secciones, ninguna de ellas es obligatoria
- Si declaras alguna variable deberás declarar la DATA DIVISION y la WORKING-STORAGE SECTION
    - FILE SECTION
      - En esta sección escribiremos los campos que componen los registros de todos los archivos que se vayan a utilizar
      - Deben estar declarados en la INPUT-OUTPUT SECTION. 
    - WORKING-STORAGE SECTION
      - Aqui declaro las variables del programa que no tengan nada que ver con archivos
    - LINKAGE SECTION
      - Se registran las variables que enlazarán al programa principal al que llamaremos con la orden CALL
- Hay otras secciones como la COMUNICATION SECTION que se utiliza para la comunicación entre dos programas que se comunican simultaneamente
- En SCREEN SECTION indicariamos los atributos y campos a utilizar en pantalla

~~~cbl
DATA DIVISION.
FILE SECTION. 
WORKING-STORAGE SECTION.
LINKAGE SECTION. 
~~~

### PROCEDURE DIVISION

- Donde escribimos todo lo necessario para que el programa funcione. La lógica del programa
- Programa básico
  - SALUDO no esta iniciada, no tiene ningún valor
  - MOVE inserta un dato dentro de una variable
  - Puedo concatenar la variable a la string sin ningún operando
  - Le digo que termine con STOP RUN

~~~cbl
IDENTIFICATION DIVISION.
PROGRAM-ID. DIVISION_DE_PROCEDIMIENTOS

DATA DIVISION.
FILE SECTION.
WORKING-STORAGE SECTION.
01 SALUDO PIC A(22).
01 TITULO PIC A(40) VALUE 'Tutorial Cobol'.
01 NUMERO PIC 9(1) VALUE 5.

PROCEDURE DIVISION.
MAIN-PROCEDURE.
DISPLAY 'Hola mundo'.
MOVE "Bienvenido a mi canal" TO SALUDO.
DISPLAY "Muy buenas, " SALUDO. 
DISPLAY "Titulo : " TITULO.
DISPLAY "Este es el tutorial " NUMERO.
STOP RUN.

END PROGRAM DIVISION_DE_PROCEDIMIENTOS
~~~


### PALABRAS COBOL

- Hay 4 tipos de palabras COBOL
  - Las reservadas
  - Los tipos del sistema
  - Los nombres funciones
  - Las creadas por el propio usuario (variables y constantes)
    - Estas palabras nunca podrán superar los 31 caracteres de longitud (en el nombre)
    - Solo podrás utilizar valores númericos del 0-9, letras de la A-Z y nigún simbolo a excepción del guión -
    - Nunca se puede colocar un guión al principio de la palabra
    - **COBOL no es key sensitive**
    - **El punto es crucial, obligatorio**. Hasta que el compilador no encuentra el punto no finaliza la instrucción

### Variables Constantes Display y Tipos de datos

- DISPLAY es para mostrar datos en pantalla, como un print
  - Se pueden imprimir strings, números, constantes, variables, etc
  - Siempre finaliza con un punto. **El punto es SAGRADO**
- Una constante es un valor que no cambia nunca
- Las variables si van cambiando según el progarama lo necesite
- Cada variable consta de 3 partes
  - El número de nivel
  - El nombre de la variable
  - PICTURE IS que se puede abreviar como PIC
    - PIC define dos cosas
      - El tipo de dato: X sería para alfanumérico (letras y números). Si queremos poner un numero pondremos un 9
      - Tenemos que especificar el tamaño en memoria que estoy ocupando.
      - Si escribo Hola, que son 4 caracteres, debo poner 4 x XXXX, uno para cada caracter
      - Aún definiéndola con 4 x, puedo dejarla vacía, pero en la PROCEDURE DIVISION puedo usar MOVE, pero el valor deberá tener solo 4 caracteres
      - La voy a definir con VALUE

~~~cbl
WORKING-STORAGE SECTION.
01 SALUDO PIC XXXX VALUE "Hola"
~~~

- Para mostrarla debería usar DISPLAY en la PROCEDURE DIVISION
- Si quisera escribir un numero, por ejemplo 77, debería escribir 99

~~~cbl
WORKING-STORAGE SECTION.
01 SALUDO PIC 99 VALUE 70
~~~

- Si pongo una cadena de texto larga como valor y coloco solo 4 x XXXX, va a funcionar, pero va a sacar solo los 4 primeros caracteres
- Los espacios también son caracteres
- Para evitar tener que poner tantas X como caracteres podemos usar los paréntesis
- Puedo poner más caracteres de los que hay en la cadena, pero conviene optimizar

~~~cbl
WORKING-STORAGE SECTION.
01 SALUDO PIC X(18) VALUE "Esto es una cadena"
~~~

- Lo mismo para los números 9(5) VALUE 20000

## SUMAR RESTAR MULTIPLICAR DIVIDIR

- Voy a permitir que el usuario escriba dos números en la consola
- Lo primero que voy a hacer es escribir dos variables que almacenarán cada uno de los números a operar y otra par el resultado
- **COBOL no admite acentos de forma nativa**
- En OPENCOBOLIDE se puede modificar con 
    - clic derecho -> encoding -> UTF-8
- Uso ACCEPT para guardar el valor en la variable NUM1
- Uso ADD para sumar. De esta manera guarda la suma en NUM2
- Es una lógica típica de COBOL
- Con GIVING le digo que guarde el resultado en la variabel RESULTADO
~~~cbl
WORKING-STORAGE SECTION.
01 NUM1 PIC 9(4).
01 NUM2 PIC 9(4).
01 RESULTADO PIC 9(5).

PROCEDURE DIVISION.
MAIN-PROCEDURE.
  DISPLAY "Introduce el primer numero"
  ACCEPT NUM1.
  DISPLAY "Introduce el segundo numero"
  ACCEPT NUM2.
  ADD NUM1 TO NUM2 GIVING RESULTADO.
  DISPLAY "El resultado es " RESULTADO.
  STOP RUN.
END PROGRAM OPERACIONES-BASICAS
~~~

- Para restar uso SUBTRACT en lugar de ADD y FROM en lugar de TO

> SUBTRACT NUM1 FROM NUM2 GIVING RESULTADO.

- Para multiplicar usaré MULTIPLY y en lugar de FROM, BY

> MULTIPLY NUM1 BY NUM2 GIVING RESULTADO.

- Para dividir usaré DIVIDE 

> DIVIDE NUM1 BY NUM2 GIVING RESULTADO.


## IF ELSE

- Un ejemplo de IF  ELSE
- No pongo el punto hasta el END-IF.

~~~cbl
PROCEDURE DIVISION.
MAIN-PROCEDURE.
  DISPLAY "Introduce el primer numero"
  ACCEPT NUM1.
  DISPLAY "Introduce el segundo numero"
  ACCEPT NUM2.
  ADD NUM1 TO NUM2 GIVING RESULTADO.
  DISPLAY "El resultado es " RESULTADO.
  IF RESULTADO > 50
    DISPLAY "EL numero es mayor que 50"
  ELSE 
    DISPLAY "El numero es menor o igual a 50"
    END-IF.
  STOP RUN.
END PROGRAM OPERACIONES-BASICAS
~~~