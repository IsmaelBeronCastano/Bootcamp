# KALI - Explotación vulnerabilidades en redes

- Instalar bettercap

> sudo apt-get install bettercap

## ARP Spoofing

- Se usa ARP cuando tenemos una IP pero no sabemos su MAC, se envia un broadcast para obtener la mac
- Con ARP spoofing envenenamos con una ARP falsa, mandando paquetes continuamente pasando la ip del router como la mia y mi mac
- Normalmente el .1 es la dirección del router
- Mi objetuvo es asociar mi mac en la maquina objetivo con la ip del router

> sudo /go/bin/bettercap
> set arp.spoof.targets IP_OBJETIVO
> arp.spoof on
- Spameará con paquetes ARP para asociar mi mac con la ip del router
- Con wireshark correindo en local puedo ver las conexiones de la máquina objetivo
- Tecnica popular para hacer el man in the middle
- Para hacerlo **con la ui** de Ettercap gráfica
- Sniff/Unified Sniffing, (el Bridge es por si tengo dos interfaces de red) 
- Elijo mi interfaz de red (wlan0)
- En Hosts/scan for hosts
- Elijo los targets, selecciono y agrego con add target1 y add target 2
- En Mtm (man in the middle) Arp spoofing/sniff remote connections OK

## DNS Spoofing

- DNS se utiliza para resolver nombres de dominio y asociarlos a una ip
- Se puede hacer cuando llegue esa petición de facebook.com y responder con otra ip que lleva a mi web server con una página igual que facebook
- De esta manera introducirá las credenciales
- Una vez en medio de a comunicación esperaremos que lance una petición DNS para responder con una web falsa
- Desde home

> sudo /go/bin/bettercap 

- Hago el ataque ARP Spoofing anterior
- Luego programos que responda con mi server cuando busque facebook.es

> set dns.spoof
> set dns.spoof.domains facebook.es
> set dns.spoof.address ip_mi_web_server
> dns.spoof.on
----

## Social Engineering Toolkit (SET)

- Viene instalada en kali
> sudo setoolkit

- En 1 social engineering atacks/2 web site atacks/ 5 web jacking atack method/3 custom import
- Le paso la ip de mi kali
- Tengo que pasarle una ruta que quiero que clone. 
  - Voy a facebook.es y guardo la página como html (solo html)
  - Le paso la ruta /home/Desktop/index.html (guardé la página en el escritorio)
- Url of the website you imported: facebook.es
  - Desactivar apache si el puerto 80 está ocupado
- Si voy a 127.0.0.1 aparece un link diciendo que la página se ha movido a otra url
- Si clicas te lleva a la pagina facebook fake
----

## Manipulación de tráfico de red en tiempo real

- Cuando usamos dns spoofing nos situamos en medio de la comunicación de dos nodos
- Vamos a mandar paquetes falsos y modificaremos los paquetes originales para engañar
- Usaremos **Polymorph** (app del autor)
- Instalo las dependencias
- Hay que instalar el python-netfilterqueue aparte

> pip3 install polymorph
> polymorph //requiere privilegios de root

- Con polymorph capturo un paquete que quiero modificar
- Una vez lo tengo, polymorph genera una plantilla
- A partir de esa plantilla voy a poder ejecutar funciones de python para modificar los paquetes que se intercambian
- Para ello debo realizar un método como ARP Spoofing para situarme en medio, Polymorph tiene una opción nativa para ello


-----

