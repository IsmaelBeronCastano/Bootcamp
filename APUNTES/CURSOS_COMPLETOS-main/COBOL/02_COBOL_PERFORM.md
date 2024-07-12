# 02 COBOL BASICO

## Párrafos o Rutinas con PERFORM

- Con PERFORM puedes saltar de una rutina a otra
- Muy útil para reutilizar código
- Cada vez que necesites que se ejecute un código puedes llamar a la rutina con PERFORM
- Cuidado con los bucles infinitos
- Puedo colocar el STOP RUN. en alguna de las rutinas, no necesariamente al final del código
- END PROGRAM si va al final siempre

~~~cbl
PROCEDURE DIVISION.
MAIN-PROCEDURE.
RUTINA01.
    DISPLAY "Esta es la rutina 1."
    PERFORM RUTINA03.
RUTINA02.
    DISPLAY "Esta es la rutina 2."
    PERFORM RUTINA04.
RUTINA03.
    DISPLAY "Esta es la rutina 3."
    PERFORM RUTINA02.
RUTINA04.
    DISPLAY "Esta es a rutina 4."
    DISPLAY "Finaliza el programa"
        STOP RUN.
END PROGRAM RUTINAS-PERFORM
~~~

## PARRAFOS O RUTINAS CON GO TO

- El GO TO tiene una función parecida que el PERFORM
- También me sirve para saltar a algún otro código
- En PREGUNTA voy a CONTINUACION con el PERFORM
  - Guardo con ACCEPT en la variable SI-O-NO de un caracter la S o la N
  - Volvemos a pregunta pero después de CONTINUACION, por lo que entra en el IF
  - Si es una N con GO TO vamos a finalizar programa
  - Si es una S vamos a PROGRAMA
  - Si se equivoca va al ELSE
- La diferencia es que GO TO va a donde se le dirige y lee todas las lineas de código hacia abajo
- PERFORM hace el trabajo y vuelve al incio (en este caso debajo de PERFORM CONTINUACION)
- Si en lugar de poner PERFORM CONTINUACION pusiera GO TO el programa no funcionaría
- Iría a CONTINUACION, guardaría la variable y pasaría a PROGRAMA para acabar el programa
- Aunque pusiera una N imprimiria igual "Se ejecuta el programa" y finaliza el programa

~~~cbl
WORKING-STORAGE SECTION.
01 SI-O_NO PIC X.

PROCEDURE DIVISION.
MAIN_PROCEDURE.

    PREGUNTA.

    PERFORM CONTINUACION.

    IF SI-O-NO = "N" OR SI-O-NO = "n"
        GO TO FINALIZA-PROGRAMA.
    IF SI-O-NO = "S" OR SI-O-NO = "s"
        PERFORM PROGRAMA.
    ELSE 
        DISPLAY "Por favor, introduce una N o una S"

    FINALIZA-PROGRAMA.
        STOP RUN.

    CONTINUACION.
        DISPLAY "Ejecutar el programa S/N?"
        ACCEPT SI-O-NO.
    
    PROGRAMA.
        DISPLAY "Se ejecuta el programa"
END PROGRAM GO-TO-PROGRAM
~~~

## RUTINAS Y CALCULOS REPETITIVOS

- Creo las variables
- REINICIA PROGRAMA es para que la variable MULTIPLICADOR se resetee, PARA VOLVER AL PUNTO DE PARTIDA
- Despues del PERFORM REINICIA-PROGRAMA y reiniciar la variable vuelve arriba, debajo de REINICIA-PROGRAMA
- Guardo con ACCEPT en la variable NUMERO el número introducido en consola
- El flujo me lleva ahora a MOSTRAR-TABLA  que imprime el string y me lleva a CALCULOS
- En CALCULOS añado 1 a MULTIPLICADOR, que hasta este momento estaba a cero
- **COMPUTE sirve para hacer cálculos de otra manera**
- Hago el display del resultado
- Si el multiplicador es menor a 10 vuelve al ciclo CALCULOS con el GO TO
- Si no vuelve al incio

# NOTA: Se recomienda evitar el uso de GO TO, está casi prohibido por los riesgos que conlleva

~~~cbl
WORKING-STORAGE SECTION.
01 NUMERO PIC 99.
01 MULTIPLICADOR PIC 999.
01 RESULTADO PIC 9999.
01 SALIDA PIC XXXXX.

PROCEDURE DIVISION.

    INICIO.
    DISPLAY "Para sali introduce "salir" en la consola"
    DISPLAY "Para multiplicar pulsa intro"
    ACCEPT SALIDA.
    IF SALIDA = "salir"
        GO TO FINALIZAR.
    ELSE
    PERFORM REINICIA-PROGRAMA.
    PERFORM INTRODUCE-NUMERO.
    PERFORM MOSTRAR-TABLA.


    FINALIZAR.
        STOP RUN.

    REINCIA-PROGRAMA.
        MOVE 0 TO MULTIPLICADOR.

    INTRODUCE-NUMERO.
        DISPLAY "INTRODUCE UN NUMERO"
        ACCEPT NUMERO.
    
    MOSTRAR-TABLA.
        DISPLAY "LA TABLA DEL NUMERO " NUMERO ":"
        PERFORM CALCULOS.
    
    CALCULOS.
        ADD 1 TO MULTIPLICADOR.
        COMPUTE RESULTADO = NUMERO * MULTIPLICADOR.
        DISPLAY NUMERO "*" MULTIPLICADOR "=" RESULTADO.
    IF MULTIPLICADOR < 10
        GO TO CALCULOS.
    PERFORM INICIO.

END PROGRAM CALCULATOR
~~~

- **Para no usar el GO TO podríamos usar el PERFORM en CALCULOS.**

~~~cbl
PERFORM CALCULOS UNTIL MULTIPLICADOR < 10
~~~

- También podría ahorrarme la condición usando la palabra TIMES con el PERFORM
- En MOSTRAR-TABLA.

> PERFORM CALCULOS 10 TIMES.

## PERFORM THRU

- Vamos a ver cómo escribir un PERFORM que llame a dos rutinas a la vez
- THRU solo admite dos rutinas a la vez
- Si te pasas de las lineas rojas que marca el editor como los limites de COBOL, puedes poner el DISPLAY y denajo el código
- Hasta que COBOL no encuentra el punto lo considera la misma linea

~~~cbl
PROCEDURE DIVISION.
MAIN-PROCEDURE.

SOLICITA-DATOS.
PERFORM SOLICITA-NOMBRE THRU SOLICITA-APELLIDOS.
PERFORM SOLICITA-EDAD.
DISPLAY 
"NOMBRE: " NOMBRE "APELLIDOS: " 
APELLIDOS "EDAD: " EDAD.
    STOP RUN.

SOLICITA-NOMBRE.
    DISPLAY "INTRODUCE TU NOMBRE:"
    ACCEPT NOMBRE.
SOLICITA-APELLIDOS.
    DISPLAY "INTRODUCE TUS APELLIDOS:"
    ACCEPT APELLIDOS.
SOLICITA-EDAD.
    DISPLAY "INTRODUCE TU EDAD:
    ACCEPT EDAD.
END PROGRAM PROGRAM-THRU
~~~

## PERFORM VARYING

- VARYING es capaz de incrementar y decrementar valores en las variables
- Uso FROM 1 BY 1 para incrementar de 1 en 1 NUMERO hasta que valga 100 

~~~cbl
PROCEDURE DIVISION.
INICIO.
    PERFORM OPERACION VARYING NUMERO FROM 1 BY 1 UNTIL NUMERO > 100.
    STOP RUN.
OPERACION.
    DISPLAY NUMERO.
END PROGRAM USAR-VARYING
~~~

- ESTE CODIGIO PUEDE SIMPLIFICARSE CON UNA SOLA RUTINA
- Como voy a trabajar con la misma rutina omito el nombre de la rutina
- No pongo punto al final, por lo que necesito el END-PERFORM

~~~cbl
INICIO.
    PERFORM VARYING NUMERO FROM 1 BY 1 UNTIL NUMERO > 100 
    DISPLAY NUMERO
    END-PERFORM
    STOP RUN.
~~~

- Con FROM 1 BY 1 le digo que **empiece la variable NUMERO en 1** y que **incremente de 1 en 1**
- Puedo ponerle FROM 10 BY 5 para que empiece desde el 10 e incremente de 5 en 5
- Para restar, multiplicar y dividir sería así ( en este ejemplo no hay flujo de ejecución)

~~~cbl
INICIO.
    PERFORM OPERACION 2 TIMES.
    STOP RUN.

OPERACION1.
    SUBTRACT 1 FROM NUMERO.
    DISPLAY NUMERO.

OPERACION2.
    MULTIPLY 5 BY NUMERO.
    DISPLAY NUMERO.

OPERACION3.
    DIVIDE 2 INTO NUMERO.
    DISPLAY NUMERO.
~~~

- Para decrementar con el VARYING se podría hacer así

> PERFORM VARYING NUMERO FROM 100 BY -1 UNTIL NUMERO < 10

