# 01 KALI Avanzado - Recopilación de información


- He creado una interfaz de red virtual en VB y conectado todas las VM ahí en host only con esa interfaz
- He descargado Snort y configurado el snort.conf y las rules (ambos descargadas)
- He instalado npcap.exe necesario para snort
- Para poner en marcha Snort en el equipo host (que alberga las VM) me situo en el path de snort
- Para ver las interfaces disponibes pongo -W

> C:\Snort\bin> snort.exe -W

- Le indico con -i la interfaz (el número del listado) 
- con -A console le indico que me pase los avisos por consola
- Con -c le paso el path del archivo .conf

> C:\Snort\bin> snort.exe -i 5 -A console -c C:\Snort\etc\snort.conf

- Así lo pongo a la escucha
- Hago un scaneo desde kali con nmap
- -n para que no haga resoliución dns reversa
- Escaneo todo el segmento de red

> sudo nmap -sS -n 192.168.56.0/24

- Snort 
----

## Escaneo avanzado de Hosts parte 1

- Me han dado una máquina dentro de la infraestructura y el objetivo es comprometer todas las máquinas posibles
- Para que metsaploitable ubuntu (MU) no de problemas usar

> sudo iptables -F
> sudo iptables -S  //para comprobar

- Para hacer login en metasploitable Windows (MW) usar el ctrl derecho + supr
- En ambos el user y pass es vagrant
- En MU ssh user: vagrant password: password
- Lo primero que haría es el reconocimiento de hosts para ver cuantas máquinas hay
- Uso -n para no hacer resolucion dns reversa ya que estoy en una subred local
> nmap -n 192.168.56.0/24


- En la .105 tengo a windos server 2008 (MW)
- En la .106 tengo a MU
- snort detecta el scaneo de puertos
- Lo más probable es que el IPS hubiera mandaado este host de KALI que ha hecho el scaneo a una subred de aislamiento
- Mirando la doc de nmap, busco host discovery
- Sin el escaneo de puertos (**-sn**) me dice los hosts que están up sin que Snort lo detecte

> nmap -sn -n 192.168.56.0/24

- Tras hacer un scaneo conviene reiniciar Snort, porque una vez detectado deja de enviar mensajes para no saturar
- Si analizamos el tráfico con Wireshark veremos que todo el tráfico generado es ARP
- Es sencillo que técnicas como esta sean detectadas y es poco fiable
- ARP es muy fácil de envenenar
- Por ejemplo con un script
- Uso la librería scapy
- sniff hace de sniffer como Wireshark
- Le digo que filtre por arp, prn para pasarle la función  
- Hago el condicional (para buscar el código usar wireshark, ver la captura de un paquete ARP y en la opcinAddress Resolution Protocol/Opcode: request(1))
- en el panel grande de wireshark pone Who has this IP? es un ARP request (tiene el número 1)
- Si el packet está destinado a una ip cualquiera (lo indico con pdst una ip de la subred)
- Armo un paquete de replay, puedo mirar uno filtrando en wireshark
- En wireshark voy a OpcodeRequest, clic derecho/Apply AS filter y en la barra en el top en verde cambio el 1 por el 2
- Miro el destination en el paquete desde wireshark, en el bottom left, donde está la info de los paquetes

~~~py
from scapy.all import *

def handle_packet(packet):
    if packet[ARP].op == 1: # si el paquete es ARP request (1)
        if packet.pdst == "192.168.56.106" # le paso cualquier IP dentro de mi subred
            print("Sending ARP Response")
            reply = ARP(op=2,
            hwsrc="me_invento_la_mac_:00:FF:k9",# le digo que la ip .106 está en esta mac
            psrc="192.168.56.106", # que lo mande a la dirección original que mandó la request
            hwdst="la_direccion_mac_original_que_vi_en_wireshark" #la original que envió la request
            pdst="192.168.56.255" 
            )
            pkt = Ether(dst="la_direccion_mac_original_que_vi_en_wireshar", src="me_invento_la_mac_:00:FF:k9") / reply
            send(pkt)
        

sniff(filter="arp", prn=handle_packet)
~~~

- Pongo el script a hacer sniffing de ARP
> sudo pyhton3 arp_scan_spoof
------

## Escaneo avanzado de Hosts parte 2

- -PS forja un paquete TCP vacío con el SYN FLAG a On y lo manda al puerto 80

> nmap -PS

- Snort lo detecta
- Si le añado el -sn para evitar el scaneo de puertos acierta y no me da ni la .1 ni la .255
- Snort no lo detecta con el -sn y el script de arp-spoofing tampoco ha engañado a nmap, porque nmap intentó comprobar si eran correctas
- Por lo que para escaneo de hosts **el más recomendable** sería
- -n para evitar la resolucion de dns inversa, -sn para evitar el escaneo de puertos, -PS para que envie un pauquete vacío con la flag SYN al puerto 80
- **Escaneo de hosts "indetectable y más fiable**"

> nmap -n -sn -PS 192.168.1.106

- Puedo indicarle otro puerto y no pasa nada si ese puerto está cerrado
-  Aunque le responda con un reset de la conexión, nmap va a saber que la máquina está activa

> namp -n -sn -PS22 192.168.1.106

- Con -PU me da como host activos el .1 y el .254
- Cuando esto pasa es que no ha comprobado los hosts

> namp -n -sn -PU 192.168.1.106

- Con -PA pasa lo mismo, cuando no se le pasa escaneo de puertos no comprueban el reconocimiento de hosts
- Lo que hacen es descubrimiento de ARP
- Con estas técnicas también es posible ejecutar el script de arp_spoof.py
-----

## Escaneo avanzado de puertos

- Hago un scaneo de hosts y obtengo la ip atacable 192.169.56.105 
- Sondeo de puertos hay un montón

> sudo nmap -n -sS 192.168.56.105

- Snort lo detecta, y un IPS nos bannearía de la red
- Cualquier escaneo de puertos me lo detecta Snort, pues se envían muchos paquetes en muy poco tiempo
- Una técnica para tratar de evadir Snort
- Para limitar el volumen de tráfico de red a tantos puertos, puedo escanear el top 5 de puertos

> sudo nmap -sn -sS --top-ports 5 192.168.56.105

- Snort no me ha detectado, desde wireshark apenas he visto tráfico
- Con --top-ports 10 genera suficiente tráfico para que Snort lo detecte
- También puedo usar -p para indicarle los puertos

> sudo nmap -sn -sS -p10,11,22 192.168.56.105

- Entonces una buena manera es **limitar los puertos!**
- Sencilla pero efectiva!
- Lo estamos utilizando con -sS (TCP/SYNC)
- Hay más opciones como la fragmentación de paquetes
----
-D
## Escaneo utilizando señuelos nmap

- -D (decoy scan)
- Nmap hará una especie de spoofing en la máquina desde donde se origina el scaneo
- Mi objetivo es para que no identifiquen que el scaneo es desde mi máquina, enviaré paquetes modificando mi ip
- De esta manera no sabrá cual es la máquina atacante
- Uso con -D ips que estén activas en la red, pongo ME para decir que esta IP es la mia (pero es fake)
- Le paso la ip a atacar

> sudo nmap -sS -n -D 192.168.56.1,ME 192.168.56.106

- Snort lo detecta como desde la .1 y no mi ip. Obtengo los puertos abiertos
- Al venir del .1 lia un poco la troca, se piensa que es un error para los analistas
-----

## Spoofing de la máquina atacante

- Bastante parecida a la anterior
- No enviaremos pauqtes adicionales, si no los que comprenden al escaneo
- Usaremos -S con la ip falsa seguida de la ip objetivo
- Debo agregar la interfaz de red y con -Pn (no escaneo de hosts)

> sudo namp -S 192.168.56.1 -n 192.168.56.105

- Error repotrtado de la versión 7 de nmap
- Útil Cuando tenemos firewalls o listas de control de acceso ip (el caso anterior también)
- A veces el firewall también restringe el puerto de la_direccion_mac_original_que_vi_en_wireshar
- Puedo añadirlo usando --source-port 80 y especificarle el puerto que quiero escanear con -p 21

> sudo namp -S 192.168.56.1 --source-port 80 -p21 -n 192.168.56.105 

- Puedo usar estas opciones con la técnica anterior

> sudo nmap -sS -n -D 192.168.56.1,ME 192.168.56.106 --source-port 80 -p 21
------

## Control de la velocidad de escaneo con nmap

- Una de las técnicas por excelencia para evadir firewalls, IDS e IPS
- Podemos controlar el tiempo de envio de paquetes en paralelo, el tiempo que queremos que espere...
- El tiempo que va a tardar en el envio de paquetes es lo que nos interesa
- -T permite un numero del 0 al 5, 0 paranoico (escaneo cada mucho tiempo), 3 normal, 4 agresivo
- Con --scan-delay podemos indicarle cuantos segundos queremos que espere entre paquete y paquete
- Aún así metiédole delays de 10 segundos Snort es capaz de detectarlo
- Aún con el scan paranoico (que tarda minutos) podriamos ser detectados
- Conviene (si acaso) elegir un número reducido de puertos
- Se pueden programar bash scripts sencillitos, para que escanee puertos de 2 en 2
- Los IDS siguen los patrones de Nmap para detectarlo
- Por ejemplo hacer un for del 0 al 30 de 2 en 2, y que tarde 30 segundos en iniciar un nuevo escaneo de dos puertos

~~~bash
for i in {0..30..2}; do; sudo nmap -sS -p$(($i+1))-$((i+2)) -n 192.168.56.105; sleep 30; done;
~~~

## ipv6

- 
----

## Escaneo de servicios avanzado


