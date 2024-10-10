# 02 CIBERSEGURIDAD DEFENSIVA - CRIPTOGRAFÍA

## Criptosistema

- Se trata de un emisor de tecto plano que utiliza una clave de cifrado junto a un algoritmo de cifrado para enviar un texto plano a un emisor que tendrá una clave de descifrado (que puede ser la misma que de cifrado o no) y un algoritmo de descifrado para desencriptar el mensaje


## Clasificación de los Criptosistemas
- La clave de cifrado/descifrado:
  - Simétricos: misma clave de cifrado y descifrado
  - Asimétricos: clasves distintas
- El tipo de texto plano:
  - Monoalfabéticos: se usa el mismo alfabeto
  - Polialfabéticos: se usan distintos alfabetos para el cifrado
  - Numéricos
- La manera en la que funcionan:
  - Transposición
  - Sustitución 
  - Bloques
  - Stream
- Las capacidades de seguriddad que proporcionan:
  - Confidencialidad
  - Integridad
  - Autenticación
  - No repudio
-----

## Modelos de ataques teóricos a un Criptosistema

- Ciphertext-only attacks: El atacante conoce el algoritmo de cifrado y algunos textos cifrados (fuerza bruta)
- Known-plaintext attacks: El atacante conoce el cifrado y algunos pares de texto plano y cifrados
- Chose-plaintext attacks: El atacante conoce el cifrado y algunos pares de texto plano y cifrados de los cuales ha podido seleccionar el tecto plano
- Chosen-ciphertext attacks: El atacante conoce el cifrado y algunos pares de texto plano y cifrados de los cuales ha podido seleccionar el texto plano y/o cifrado
-----

## Romper/Hackear un criptosistema

- Normalmente existen dos formas
  - Encontrar un método para descifrar la clave de cifrado
  - Encontrar una vulnerabilidad en el algoritmo
----

## Fuerza bruta y otras técnicas de ataque

- Fuerza bruta es del tipo ciphertext-only attacks:
  - El atacante interceopta texto cifrado con un criptosistema conocido (conoce el algoritmo pero no la clave)
  - Selecciona una clave del espacio de claves
  - Intenta descifrar con esa clave si el mensaje tiene sentido
### Importancia del espacio de claves
- El espacio de claves comprende  todas las claves de cifrado posibles para un criptosistema concreto
- Para evitar un ataque deben existir las suficientes claves como para que no resulte práctico el procesp
- Todas las claves de descifrado deben tener la misma probabilidad de ser elegidas. De no ser así el espacio se reduce
### Otros métodos de ataque
- Time memory trade-off attacks: El atacante construye una tabla con textos cifrados a partir de textos planos que se envían con frecuencua utilizando un número elevado de claves
  - Cuando el atacante intercepta un codigo cifrado para el que cree conocer el texto plano , comprueba si puede descifrar la clave
- Primitive-specific attacks: Differencial and linear cryptoanalisis, Birthday attacks, Statistical attacks
- Side-channel attacks: Estos ataques no se realizan directamente sobre el criptosistema si no sobre su implementación
  - Algunos son timing attacks, Power analysis, Fault analysis
----

## Cifrado simple por sustitución

- Consiste en reordenar el alfabeto
- Asignarle a la A una T, a la B una O, etc
- Se presume que el número de combinaciones es 4*10**26 (4 por diez elevado a 26)
- Para hacerse una idea se dice que en el universo hay 10**22 estrellas
- Un ataque que podría funcionar es el estadistico

## Ataques estadisticos

- Es del grupo Primitive-specific attacks
- Útil para el atacar el cifrado simple por sustitución
- Hacen uso de estadisticas a traves de texto plano y texto cifrado
- El análisis de frecuencia es el más utilizado
- Dentro de un idioma en particular la frecuencia de cada letra que aparece no es casualidad
- Las letras que más se repiten las vocales, y ciertas combinaciones no arbitrarias (bigramas, trigramas, cuatrogramas)
------

## Codificación Vs Criptografía Vs Esteganografía

- Tema importante

### Codificación

- Procedimiento por el cual unos datos originales son reemplazados con el objetivo de que puedan ser enviados a través de un canal de comunicación
- El reemplazo de los datos se realiza conforme a las reglas establecidas en un esquema de codificación público
- La codificación no garantiza ninguna característica de seguridad
- Si el esquema de codificación se mantiene en secreto y solo lo conoce el emisor y el receptor, entonces podría considerarse un criptosistema
- Algunos ejemplos son : codigo MORSE, ASCII, Base 64

### Esteganografía

- Corresponde al estudio dfe la ocultación de información
- El objetivo es transmitir información oculta de manera que solo el receptor sepa extraerla
- Puede ocultarse de diferentes maeras: audio, video, texto...
- Un interceptor desconoce que hay esa información
----

## Cifrado PLayfair

- Trata de evitar el ataque por analisis de frecuencias del cifrado simple por sustitución
- Dos principales mejoras
  - Aumento del tamaño de los alfabetos utilizados (cifrado polialfabético)
  - Permite que cifrar una misma letra de texto plano produzca como resultado diferentes letras de texto cifrado
- No será un proceso simple por sustitución
- Opera sobre pares de letras (bigramas). Se puede considerar que opera sobre bloques
- Características
  - Simétrico
  - Polialfabético
  - Sustitución
  - Confidencialidad
- Puedo imaginar una matriz de 5 x 5 (% columnas y 5 filas) con una letra distinta en cada cuadrado resultante
- Se divide en dos fases de cifrado
  - Pre procesamiento del mensaje original
  - Cifrado del mensaje preprocesado
- El cuadrado tiene 25 letras, el alfabeto inglés tiene 26
- Hay una letra que falta. Sustituyo en el texto plano la letra que falta por una de las que haya en el recuadro (que no se use mucho)
- Por ejemplo de MESNAJE ESCRITO sustituyo la J por la I
- Me queda MENSAIE ESCRITO
- Como trabaja por bigramas divido el texto plano en grupos de 2
- ME NS AI EE SC RI TO
- Hay que intercalar entre las letras iguales otra letra que seleccionemos del cuadrado (playfare square)
- Puedo usar la X
- Con la letra suelta sustituyo el espacio por la X también

- ME NS AI EX ES SC IT OX

- Ahora puede cifrarse
- Sustituimos la letra que se encuentra en la columna por la siguiente de la columna. Esto sucede porque en este caso están en la misma fila consecutivas
- Si se situara en la última casilla, la sustiuiríamos por la primera casilla de la misma columna
- Cuando no se encuentran ni en la misma fila ni en la misma columna (el bigrama, las dos letras) agregaré la letra que se encuentre en la misma fila que la N y la siguiente de la columna de la segunda letra del bigrama
- La segunda letra la vamos a sustituir por la que se encuentre en la misma fila y en la misma columna que la primera letra del bigrama
- Este sistema sigue siendo vulnerable ael análisis de frecuencia de bigramas
----

## Cifrado Vigenere

- Se pensaba que era irrompible en el 1553 creado por Giovan Battista Bellaso
- Características
  - Simétrico 
  - Polialfabético
  - Sustitución
  - Confidencialidad
- Usa la dependencia posicional para evitar el análisis de frecuencias
- Se acuerda una palabra clave sobre un alfabeto
- Se usa la palabra clave seguidamente hasta sustituir la longitud del mensaje original
- passpasspasspasspass
- Se aplica una rotación sobre el alfabeto para iniciarlo en otra letra
- Esta rotación va a venir indicada por la primera letra del texto plano que coincide con la primera letra de la palabra clave
- Si el texto plano es MENSAJE PLANO y la palabra clave es PASS
- Esta M se le aplica una rotación de 15 posiciones (donde estaría la P), por lo que sería una B
-----

## perfect Secrecy

- Describe un criptosistema que no se puede romper

## One-time pads

- Caracteristicas que debe cumplir un criptosistema para tener perfect-secrecy
- Es la única técnica de cifrado que garantiza perfect secrecy
- Requisitos:
  - La clave debe tener una longitud igual o mayor que el texto plano
  - el numero de claves posibles debe de ser igual o mayor al numero de textos planos posibles
  - La clave debe ser aleatoria y seleccionada de manera uniforme entre el conjunto de todas las claves posibles
  - La clave debe ser de un solo uso. Nunca debe reutilizarse ni total ni parcialmente
  - La clave debe mantenerse en secreto por el emisor y el receptor
- Cuando aplicamos one-time pad sobre el sistema Vigenere hacemos que sea seguro
- One-time pads se utilizan en entornos muy restrictivos lo que hace que sean poco prácticos en ocasiones
  - La longitud de la clave
  - La clave debe ser generada de manera realmente aleatoria, es un proceso costoso
  - Que la clave sea de un solo uso acentúa los problemas descritos
-----

## Criptografía moderna

### Criptosistemas simétricos modernos

- Reciben commo entrada texto plano en bits
- Realizan operaciones sobre los bits
- Proporcionan como salida una secuencia de bits que se corresponde con el texto cifrado
- Clasificación: 
  - Stream Ciphers: El texto plano se procesa bit a bit
  - Block Ciphers: el texto plano se procesa en bloques (grupos) de bits 
Hay Stream Ciphers que procesan bytes que son 8 bits, por lo que también estaría trabajando por bloques
  
### Stream Ciphers

- P por cada bit (P1,P2 por el primer cero o uno, el segundo), Pn será el total de bits (Texto plano a cifrar) 
- Tenemos una clave de cifrado (secuencia de bits, no tiene que ser del mismo tamaño ni superior al texto plano) que se le pasa al keystream generator
- Keystream generator es la pieza importante de un Stream Cypher
- Este módulo convertirá la clave de cifrado y la convertirá en un string de bits del mismo tamaño que el texto plano
- Cada bit representado con una K, donde Kn es el tamaño total
- Esta cadena de bits pasa a un modulo adicional junto al texto plano para aplicar una operación **XOR**
- Procesa bit a bit del texto plano y la key string
- Si el bit del texto plano y la keystring es 0 = 0
- Si el bit del texto plano es 0 y la keystring es 1 = 1
- Si el bit del texto plano es 1 y la keystring 0 = 1
- Si los dos son 1 devuelve 0
- Para poder descifrar el texto el receptor debe disponer de:
- La clave de cifrado
- El mismo keystream generator que el emisor
- El keystrema generator forma parte de la especificación del criptosistema   
- El componente que determina un buen stream cipher es el keystream generator
  
### Propiedades de los Stream Ciphers

- Propagación de errores: al manejar bit a bit, en caso de error será solo de ese bit
- Velocidad: puesto que es sencillo y eficiente, es rápido
- Cifrado en tiempo real: al ser cifrado bit a bit puede hacerse en tiempo real
- Sincronización: Es vital que emisor y receptor mantengan sus keystreams sincronizados
- **Stream Ciphers populares**:
- Estos criptosistemas no tienen la misma aceptación que los Block Ciphers, pero son criptosistemas igual
  - RC4: el más implementado: SSL/TLS, WEP, Kerberos
  - A5/1: para securizar conexiones GSM
  - EO: para securizar Bluetooth
  - Salsa20/ChaCha20: se utiliza para SSL/TLS y ssh

### RC4

- Creado por Ronald Rivest en 1987, pero no se hizo público hasta 1994
- Nombre completo: Rivest Cipher 4
- Simétrico
- Numérico
- Stream
- Confidencialidad

### 