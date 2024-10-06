# Diego Hernán Barrientos - Escaneo de objetivos

## Tipos de scaneo

- Un scaneo intenta obtener direcciones IP específicas en la www
- Otras cosas son las versiones del SO, del kernel, procesadores, redes, puertos abiertos, servicios en ejecución, versiones de esos servicios...
- Hay básicamente tres tipos de escaneo:
- Escaneo de puertos (servicios)
- Escaneo de redes (encontrar en un rango de direcciones los hosts vivos)
- Escaneo de vulnerabilidades
- Lo que se hace es enviar ciertos paquetes con flags de transmisión de datos de uno u otro tipo
----

## Metodología

- Son 8 etapas
- 1. Chequear sistemas vivos en la red
- 2. Chequear por puertos abiertos
- 3. Identificar los servicios
- 4. Banner-grabbing /O.S fingerprinting (para sacar el SO)
- 5. Buscar vulnerablilidades
- 6. Dibujar diagramas de red de los hosts vulnerablilidades
- 7. Preparar los proxies (anonimizadores)
- 8. ATACAR!!

----

## El scaneo ICMP

- ICMP : internet control message protocol
  - Sirve para ver la congestión de la red
  - Para saber por cuantos nodos pasó la información hasta encontrar la máquina destino
- ICMP tiene diferentes tipos de mensajes
- El más conocido es el de eco, en el que se basa la herramienta PING para encontrar hosts vivos
- Devuelve una señal si el host esta vivo
- Los escaneos ICMP se pueden usar en paralelo para agilizar los progresos
- También provee información de Netbios
- Muestra el nombre de la máquina, el grupo de trabajo al que pertenece, y la MAC
- Puede resultar útil modificar el valor de espera del ping usando la opción -t
- Útil porque las máquinas se pueden poner lentas y no aparecer como vivas
- Se envian en bloque por rangos de ip
- Con Android se puede usar Angry Port Scanner
-----


## El barrido PING

- Usado para determinar los hosts vivos en un rango IP
- Consiste en una consulta de ICMP ECHO
- Por cada host vivo se enviará una respuesta
- Los parámetros son (echo rquest)
  - Type 8 /Type 0 si es la response
  - Code 0
  - Checksum
  - Identifier 1
  - Sequence 1
  - Message "test packet"
- Un barrido ping puede saltar la alarma de un IDS
- Un buen barredor intercala las IPs, primero la .1m luego la .20, luego la .13, etc
- Infiltrator es una buena herramienta de windows
- Para android está ping sweep
- Pide un ip de start, cuantas ondas, puedo clicar en randomize para que sean ips aleatorias
------

## Chequeo de puertos abiertos y 3 way handshake (necesario para la comunicación)

- Antes de intercambiar info la máquina A envía una señal SYN a B, se quiere conectar al puerto X
- Si el puerto está a la escucha B devuelve un SYN-ACK, ACK es como un OK (Acknowledge) 
- A envia un ACK a B conforme ha recibido que B tiene el puerto abierto y se establece la conexión
- Las banderas TCP se usan (1 o 0, encendido o apagado) para el saludo de tres vias
- En este caso SYN y ACK, estamos en capa de Transporte que tendrá unos puertos destinados para el intercambio de info
- Si el destino tiene el puerto 80 será un web server
- WireShark es un sniffer de redes
- En los paquetes TCP tengo el número (que lo pone el softeware)
  - El tiempo en el que llegó el segmento
  - Tenemos la ip fuente y destino 
  - El protocolo 
  - Los puertos
  - La data
----



