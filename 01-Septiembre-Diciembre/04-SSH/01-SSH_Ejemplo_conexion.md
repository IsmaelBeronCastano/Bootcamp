# 01 SSH - EJEMPLO DE CONEXION

- Instalaremos la suite OpneSSH
- Puedo elegir entre instalar cliente (openssh-client), servidor (openssh-server) o las dos cosas (ssh)
- En debian

>  sudo apt install ssh

- El comando **ssh** nos permite trabajar con el cliente ssh 
- El servicio puede ser configurado para trabajar en un puerto especifico
- Necesitamos un cliente y un servidor (2 equipos)
- En el cliente correré Debian y en el server Ubuntu Server
- Para saber que distro estoy corriendo

> cat /etc/issue

- Los nodos de ssh se usan autenticacion con claves asimétricas, públicas y privadas
- Es necesario saber con qué usuario trabajamos en un ordenador y contra qué servidor me voy a conectar 
- Para saber la ip en debian

> ip a

- Si no aparece ipv4 mirar aquí https://myblog.ricardovargas.me/como-configurar-una-ip-estatica-en-linux-debian-11-3/
  - Básicamente ip -c link show //para ver el nombre del adaptador
  - ip -c addr show nombre_adaptador //para ver la info del adaptador concreto
- En mi caso, debian (el cliente) tiene 192.168.0.23
- Para ver los servicios uso ss que es la versión nueva de netstat

> ss -npltu

- **A partir de ahora S es el server y C el cliente**
- En el server vemos con este comando que en cualquier dirección local (marcado con un asterisco en el puerto 22) *:22
- Para conectarme desde el C, con -l le digo a qué usuario (del server) remoto me quiero conectar seguido de la ip del server

> ssh -l user 192.168.1.12

- Si no hay un fingerprint (asociación previa) me preguntará si quiero conectar, le digo que si.
- Me pide la contraseña del user de la 192.168.1.13
- Con ip a puedo ver que mi ip es la del server
>ip a

- exit para salir de la consola
> exit

- En lugar de user puedo loggearme como root 
- No me pide contraseña porque me he autenticado por medio de una llave asimétrica
- Poco recomendable loggearme como root, mejor usar sudo
- Puedo conectarme tambien desde el C con la @

> ssh user@192.168.1.13

- Pide añadir el fingerprint, una vez dicho que si, esto hace algunos cambios en archivos de configuración
- Una vez ingresado se ha creado el directorio .ssh que contiene algunas claves
- El archivo modificado al ingresar en el server es known_hosts
- Puedo ver al final la IP con el algoritmo de cifrado que usamos contra el server y el fingerprint
- En el server tengo /etc/ssh con varios archivos
- Los archivos con key.pub son las claves que permiten el acceso sin autenticación
- En ssh_host_ecdsa_key.pub puedo ver el fingerprint
- Hemos agregado esa clave publica al cliente asociada a la ip del servidor 

-----
## Archivos de configuración

- Directorio general: /etc/ssh/
- Claves y conf. de usuario: ~/.ssh/
- Claves de host: /etc/ssh/ssh_host_*
- Conf.servidor: /etc/ssh/sshd_config
- Conf.cliente: /etc/ssh/ssh_config
- Grupos DH: etc/ssh/moduli

- Al establecer el tunel cifrado de ssh los equipos se autentican con claves únicas alojadas en /etc/ssh
- Son claves asimñetricas, tenemos la publica y la privadas
- Con **ss -npltu** nos muestra los puertos abiertos en el pc 

-----
# Ejecucion de comandos remotos

- Primero debo identificar bien los equipos

> ip a

- El cliente tiene .13 y el server .8
- Para conectarme desde el cliente uso ssh con el usuario del server seguido de una arroba y la ip del server

> ssh migue@192.168.1.8

- Puedo poner a ejecutar un comando directamente en la instrucción de conexión

> ssh migue@192.168.1.8 ip a

- Para pasar un script pasándolo de entrada 

> nano /tmp/script.sh

~~~sh
#!/bin/bash

free -h
dfc
~~~

- Le doy permisos de ejecución

> chmod +x /tmp/script.sh
> ssh migue@192.168.1.8 < /tmp/script.sh 

- Puedo redireccionar la salida a un archivo

> ssh migue@192.168.1.8 < /tmp/script.sh > /tmp/salida