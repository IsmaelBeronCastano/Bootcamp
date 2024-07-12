# 03 COBOL NUMEROS Y VARIABLES

## POSITIVOS NEGATIVOS Y DECIMALES

- Podemos mostrar valores decimales escribiendo una V en el PIC
- Si quiero que tenga dos caracteres enteros y dos decimales escribo una V en medio.
- La **V va a representar la coma del decimal** (el punto)

~~~cbl
WORKING-STORAGE SECTION.
01 NUM1 PIC 99V99.
~~~

- Para trabajar con número negativos uso S delante de los dígitos del PIC
- Si el numero de la variable es positivo lo mostrará con un + delante
- Si es negativo lo mostrará con un - delante

~~~cbl
WORKING-STORAGE SECTION.
01 NUM2 PIC S9999.

PROCEDURE DIVISION.
MOVE -1234 TO NUM2.
DISPLAY NUM2.    
~~~

- Si no tengo la S en el PIC y uso un numero negativo, el programa compila igual pero va a ignorar el símbolo -
- Podemos combinar la S con la V para tener números decimales negativos

~~~cbl
WORKING-STORAGE SECTION.
01 NUM2 PIC S99V99.

PROCEDURE DIVISION.
MOVE -12.34 TO NUM2.
DISPLAY NUM2. 
~~~

- Se puede hacer cualquier operación con los números negativos


## Asignar multiples valores a variables con MOVE

- Para asignar un valor a varias variables **SE CONCATENAN** directamente
- Ahora todas las variables tienen el valor de 10

~~~cbl
MOVE 10 TO NUM1 NUM2 NUM3 NUM4 NUM5
~~~

- Se pueden iniciar variables con un espacio en blanco, pero tambien puedo usar la palabra reservada SPACE
- SPACES es lo mismo
- Se recomienda que las variables queden iniciadas siempre en COBOL.
  - Es mejor dejarlo con SPACE que sin nada
- Para los numeros tenemos ZERO, ZEROS y ZEROES

~~~cbl
01 TEXTO PIC XX VALUE " ".
01 TEXTO2 PIC XX VALUE SPACE.
01 NUMB PIC 99 VALUE ZERO.
~~~

## Caracteres de edición

- En lugar de la V puedo usar el punto en el PICTURE, pero no podré hacer cálculos con ella
- Este punto se está comportando como un caracter de edición
- A estas variables se las llama VARIABLE NUMERICA EDITADA
    - Solo sirven para mostrar en DISPLAY y no para cálculos

~~~cbl
WORKING-STORAGE SECTION.
01 NUM2 PIC S99.99.
~~~

- Cómo suprimir los 00 en la salida del DISPLAY
- Puedo usar la Z para prevenir el cero delante
- Puedo poner incluso todo Z

~~~cbl
WORKING-STORAGE SECTION.
01 NUM1 PIC Z99 ZERO.
01 NUM2 PIC ZZZZZ ZERO.
~~~

## VARIABLES COMPUESTAS

- Hasta ahora solo hemos visto variables simples
- Siq ueremos cambiarla a variable compuesta o variable de estructuras hay que dejarla en el nivel 01
- También hay que quitarle el PICTURE
- Para hacerla compuesta debo añadirle otras sub variables dentro
- Se especifica el nivel de ejecución con un TAB
    - Las sub variables pueden tener los números de nivel del 02 al 49
- Se pueden poner sub variables sin limite
- El objetivo de estas es poder utilizarlas como una simple variable
- Como si estas 4 variables se trataran de una sola
~~~cbl
WORKING-STORAGE SECTION.
01 VARIABLE-COMPUESTA.
    02 NUM1 PIC 99 VALUE 10.
    02 NUM2 PIC 99 VALUE 20.
    02 NUM3 PIC 99 VALUE 30.
    02 NUM4 PIC 99 VALUE SPACE.

PROCEDURE DIVISION.

DISPLAY NUM3.
~~~

- Hasta aquí es como cualquier variable normal
- Lo especial que tiene es que con un solo DISPLAY puedo mostrar el valor de las 4 sub variables

## Numeros de nivel de variables

- Los números de nivel indican al compilador el tipo de variable que es
- 01 identifica la primera entrada de un campo que se va a subdividir o una variable simple
- del 02 al 49 indican las subvariables
- Si una sub variable es de nivel 02 todo **el resto de subvariables serán también 02**
- Si tengo varias variables compuestas puedo usar diferentes niveles para las sub variables
  - No tienen porque ser numeros consecutivos
  - Si uso 02 para las subvariables de una variable compuesta, para otra variable compuesta puedo usar 05 o el que quiera para sus subvariables
- El nivel 77 se usa para las variables que no se vana subdividir
- Si tienes claro que esa variable no se va a subdividir **deberías usar 77**
- 88 se usa para posibles valores que se pueden almacenar en una variable
  - Para estas variables si le puedo especificar un PICTURE
  - Uso THRU para definir rangos de edad

~~~cbl
WORKING-STORAGE SECTION.

01 EDAD PIC 999.
    88 JOVEN VALUE 1 THRU 40.
    88 MADURO VALUE 40 THRU 65.
    88 ANCIANO VALUE 65 THRU 100.

PROCEDURE DIVISION.
MAIN-PROCEDURE.

DISPLAY "Introduce tu edad: "
ACCEPT EDAD.
    IF JOVEN
    DISPLAY "Eres joven".
    IF MADURO
    DISPLAY "Eres maduro".
    IF ANCIANO
    DISPLAY "Eres anciano".
    STOP RUN.
END PROGRAM EDADES.
~~~

## Constantes FILLER

- El valor que ponemos en un DISPLAY solo se puede modificar editando el programa y compilando de nuevo
- Por eso las DISPLAY son constantes
- Podemos crear constantes dentro de variables compuestas
- Para añadir una constante dentro de una variable compuesta podemos hacerlo con FILLER
- No tengo manera de cambiar el valor de FILLER, si el de TEXTO1 y TEXTO2

~~~cbl
WORKING-STORAGE.
01 VARIABLE-COMPUESTA.
    05 TEXTO1 PIC X(15) VALUE "Texto 1"
    05 FILLER PIC X(15) VALUE "Texto Filler"
    05 TEXTO2 PIC X(15) VALUE "Texto 2"

PROCEDURE DIVISION.
MAIN-PROCEDURE.

    DISPLAY VARIABLE-COMPUESTA.
    MOVE "Nuevo Valor" TO TEXTO1.
    MOVE "Nuevo Valor" TO TEXTO2.
    DISPLAY VARIABLE-COMPUESTA.
    STOP RUN.

END PROGRAM USO-DE-FILLER.
~~~

## Estructuras anidadas

- Podemos anidar variables compuestas dentro de otras variables compuestas
- Para anidar variables dentro de subvariables debo usar el mismo numero de nivel y no usar PICTURE, directamente el punto
- Debajo debo anotar las subvariables con otro numero de nivel

~~~cbl
WORKING-STORAGE SECTION.
01 VARIABLE-COMPUESTA.
    05 TEXTO1 PIC X(15) VALUE "ESTE TEXTO".
    05 TEXTO2 PIC X(15) VALUE "PERTENECE A ESTRUCTURA PRINCIPAL".
    05 SUBVARIABLE-COMPUESTA.
        10 TEXTO3 PIC X(15) VALUE "ESTE TEXTO".
        10 TEXTO4 PIC X(15) VALUE "PERTENECE A ESTRUCTURA SECUNDARIA".
PROCEDURE DIVISION.
MAIN-PROCEDURE.
    DISPLAY VARIABLE-COMPUESTA.
    STOP RUN.
END PROGRAM ESTRUCTURAS-ANIDADAS.
~~~

- Este display me imprime todas las variables, tanto de la estructura principal  y secundaria
- Si en el DISPLAY pongo SUBVARIABLE-COMPUESTA obviará la estructura principal e iomprimirá solo TEXTO3 y TEXTO4
- Se puede seguir anidando indefinidamente

# NOTA: En OPENCOBOLIDE se puede modificar para que acepte acentos

- clic derecho -> encoding -> UTF-8