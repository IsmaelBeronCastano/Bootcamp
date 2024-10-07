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

## Escaneo avanzado de Hosts

- 