# 02 SSH Transferencia de archivos

- Podemos transferir archivos con scp
- Podemos copiar un archivo o un directorio desde local a remoto y viceversa
- Para hacer un upload con el comando scp le paso el archivo, el usuario y la ip del server al que me conecto y la ruta donde lo quiero

> scp archivo.txt user@192.168.56.107:/tmp

- Para hacerlo con un directorio usar -r (de recursividad)
- Para descargar 
> scp usuario@servidor:ruta_servidor_donde_esta_el_archivo ruta_ordenador_local_donde_poner_el_archivo
-----

# sftp (secure FTP)

- sftp permite trabajar con archivos locales y remotos sin salir de la sesion ssh
- Es muy útil porque de esta manera puedo listar los archivos que quiero subir o descargar dentro de la misma sesión
- La diferencia con ftp, sftp corre sobre un túnel seguro de ssh
- Usaré get para descargar archivos y put para subirlos
- Me logueo con sftp y el nombre_de_usuario@ip_del_servidor

> sftp migue@192.168.56.107
> sftp> help //para listar los comandos

- Uso cd para cambiar de path del lado del server y lcd del lado del cliente (local)

> sftp> pwd  //para saber en que directorio del server estoy, para local usaré lpwd

- ln para crear enlaces simbólicos del lado del servidor
- !command me permite ejecutar un comando en local y volver a sftp
- ! la exclamación sola es como poner exit
- Muy útil!
- Con put hago el upload

> put archivo

- Debo estar en la ruta del archivo y en la ruta del server donde quiero que vaya
- Para obtener un archivo y cambiar el nombre al guardarlo solo tengo que ponerlo a continuación

> sftp archivo1 archivo_copia
> sftp -r directorio

- Puedo modificar el archivo desde el servidor con nano o vim
- sftp contiene comandos interactivos como chgrp, chmod, chown, df 
- Con get -p carga los mimos permisos y el accestime igual al del archivo remoto
- Con put igual
- - a va a descargar pero no va a considerar si los archivos han cambiado
- Para más info **man sftp**
- **sftp configuración chroot**
- Que el usuario cuando se conecta al servidor no vea otros archivos del sistema, solo los del usuario logeado por ssh
- Se puede lograr en sftp
- Si no yo puedo acceder a /etc/ con todos los archivos de configuración del servidor
- En el server hay que modificar el servicio de ss

> nano /etc/ssh/sshd_config

- lineas de configuración que son validas para los usuarios que pertenezcan al grupo sftp
~~~bash
Match Group sftp
    ChrootDirectory %h ##directorio home del usuario que se está conectando
    ForceCommand internal-sftp ## forzar que solo puede usar el comando sftp que utiliza ssh
    X11Forwarding no ## desactivamos la interfaz gráfica (hardening)
    AllowTcpForwarding no ## desactivamos cualquier otro protocolo (hardening)
~~~

- Creo el grupo en el servidor

> addgroup sftp
> gpasswd -a alumno sftp

- El propietario del directorio home del usuario (alumno) debe ser de root
- Es un punto flojo
>  chown root /home/alumno

- Entonces hemos enjaulado a su home al usuario de sftp
  - Configurando el archivo de sshd_config
  - La configuración de un grupo, agregar al usuario
  - Cambiar el dueño del grupo home/usuario a root
------

## SSHFS - SSH FileSystem