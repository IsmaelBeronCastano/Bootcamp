# 01 KALI - Recopilación activa

## Descubrimiento de hosts

- -sL (list scan)
- -sn (no port scan) 
- Descubrimiento de host en una red. Busca el puerto 80 y el 443
- Si responde con un ACK se refiere a que si hay alguien

> nmap -sn 192.168.0.10

- Con sudo nmap -sn funciona diferente
- Constata el equipo objetivo mediante una petición ARP. Es menos intrusiva
- -Pn (no host discovery) 
- Para hacer un host discovery sobre un rango ip

> nmap -sn 192.168.1.0/24

- De esta manera primero lo intenta con un Broadcast ARP y luego tratará de establecer la conexión TCP con un ACK al puerto 80
- Puede ser que haya un host pero que no tenga el puerto 80, por lo que será un falso negativo
- Con sudo usará ARP, es más probable que el resultado sea más real
- -PS  tratará de mandar un paquete TCP SYN 
- Patra que haga menos ruido le indico un puerto

> nmap -PS 192.168.1.10 -p 80
> namp -PS21,22,23 192.168.1.10 -p 21
----

## Escaneo de puertos

- -sS (TCP SYN scan)
- -sT (TCP connect scan)
- -sU (UDP scan)
- El puerto pude aparecer open, closed, filtered, unfiltered, open|filtered, closed|filtered
- Sin especificar el puerto hará el scan a todos los puertos individuamente.
- Para un único puerto se lo idico con -p

> nmap -sS 192.168.1.10 -p 80

- De esta manera intenta realizar un 3-way handshake pero lo deja a medias enviando un RST para interactuar menos con la máquina objetivo
- Para un escaneo de todos los puertos de todos los nodos puedo poner la máscara o el rango de ip

> nmap -sS 192.168.1.0/24
> nmap -sS 192.168.1.125-23

- Puedo indicar verbosidad y la razón por la que el puerto está cerrado o no
- Con -oX puedo guardar la salida en un xml para visualizarlo después en el navegador
- Puedo aplicarle una hoja de estilos

> sudo nmap -v --reason -sS -oX puertos.xml --stylesheet="https://svn.nmap.org/nmap/docs/namp.xsl" 192.168.1.10

- Si no puedo abrirlo con el comando **xsltproc puertos.xml** o usar el navegador con **firefox puertos.xml**-
- El -v de verbosidad es **recomendable**
- Para UDP uso -sU

> nmap -sU 192.168.1.10 -p 53
----

## Descubrimiento de servicios

- Para saber la versión del servicio usaré -sV
- Uso el puerto 21 (ftp)

> sudo nmap -sV 192.168.1.10 -p 21

- Algo un poco más elaborado

> sudo nmap -v --reason -sV -oX servicios.xml --stylesheet="https://svn.nmap.org/nmap/docs/namp.xsl" 192.168.1.10-130

- Es una request muy intrusiva
-----

## Identificación del sistema

- Usar -o
- Es muy intrusivo, Un IDS posiblemente lo detecte

> sudo nmap -v -O 192.168.1.10
----

## SMB y SNMP enumeration

- SMB es un protocolo de red con el objetivo de compartir cosas con diferentes nodos de la red
- Utiliza los puertos TCP 445, 139 y otros UDP

> sudo nmap -sS -v -p 445,139 192.168.1.10

- Los scripts de nmap están en /usr/share/nmap/scripts
- Para buscarlos desde nmap usar --script-help

> nmap --script-help "smb-*"

- Para ejecutar usar --script

> sudo nmap -v -sS -p 139,445 --script=smb-os-dicovery 192.168.1.10 

- Puedo buscar carpetas compartidas, usuarios...

## SNMP

- Sirve para gestionar el comportamiento de dispositivos de red, servidores

> sudo nmap -v -sS -p 161 192.168.1.10

- Puedo buscar scripts según lo que quiera
- SNMP suele estar mal configurado. Es una buena opción
- Se pueden realizar ataques de fuerza bruta con scripts de nmap
