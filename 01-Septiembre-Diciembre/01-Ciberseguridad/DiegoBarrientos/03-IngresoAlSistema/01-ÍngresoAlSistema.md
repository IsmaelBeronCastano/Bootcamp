# Diego Hernán Barrientos - Ingreso al sistema

## ARP Spoofing
- Ataque de man in the middle con AP Spoofing con la UI de Ettercap 
- Sniff/Unified Sniffing, (el Bridge es por si tengo dos interfaces de red) 
- Elijo mi interfaz de red (wlan0)
- En Hosts/scan for hosts
- Elijo los targets, selecciono y agrego con add target1 y add target 2
- En Mtm (man in the middle) Arp spoofing/sniff remote connections OK

## Ataque online

- Puedo acceder a un windos intentándolo con la cuenta de invitado sin password
- Un ataque con fuerza bruta podría ser así
- -t es un temporizador
- si -l es mayúscula (-L) le paso un archivo de texto con todos los posibles nombres de login
- Si le pongo -P también es para una lista, si le coloco -p tendría que poner la palabra patata por ejemplo

> hydra -t 1 -l administrador -P /usr/share/john/password.txt -vV 192.168.43.20

- Le paso la máscara para que busque en todo el rango las máquinas que usen netbios y samba

> nbtscan -v 192.168.43.0/24
----

## Ataque offline