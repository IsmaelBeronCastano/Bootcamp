# 01 Nmap BASICS

- Para ver los puertos más populares que escaneará por default

> sort -r -k3 /usr/share/nmap/nmap-services |grep tcp | head -n 100

- Para el manual

> nmap -h


- Para especificar un rango objetivo. -sS es por defecto

> nmap -sS 192.168.1.1-35

- Puedo usar un archivo para los inputs

> nano targets.file

~~~
192.168.1.1-30
192-168.1.35
scanme.nmap.org
~~~

- Para usarlo

> nmap -iL targets.file

- -iR escoge un numero random de objetivos. Con -v es verbose, lo incremento con -vv

> nmap -iR -vv

- Los **puertos** tienen diferentes ESTADOS
  - unfiltered es cuando es accesible pero nmap no puede determinar si está abierto o cerrado
  - open|filtered nmap no puede detrminar si esta abierto o filtrado
  - closed|filtered

## Nmap Discovery and Ping scanning

- El primer paso es decubrir puertos abiertos y ver que servicios corre el host
- Tienes las **HOST DISCOVERY** options que consultar en nmap -h
- Sin Host Discovery options nmap lanza un ping (ICMP echo request), TCP SYN packet to port 443, TCP ACK packet to port 80, y ICMP timestamp request
  - Excepciones: ARP y Neighbour Discovery
- Podemos usar -sL para simple List scan

> nmap facebook.com/24 -sL

- ping scan es más intrusivo. Solo devuelve los hosts activos

> nmap 192.168.1.1/24 -sn

- -Pn trata todos los hosts como si estuvieran online (se salta el host discovery)
- Puedo enviar paquetes TCP,SYN/ACK UDP o STCP a puertos específicos con -PS/PA/PU/PY

> nmap 192.168.1.1-5 -PS22-25,80,113,1050,35000 -v -sn

- 































