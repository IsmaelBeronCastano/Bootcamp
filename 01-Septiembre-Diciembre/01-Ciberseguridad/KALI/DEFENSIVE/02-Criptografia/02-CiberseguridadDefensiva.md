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

## Codificación Vs Criptografía