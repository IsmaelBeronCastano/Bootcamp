# 01 SSH Ejemplo Conexión

- Instalaremos la suite OpneSSH
- Puedo elegir entre instalar cliente (openssh-client), servidor (openssh-server) o las dos cosas (ssh)
- En debian

>  sudo apt install ssh

- El comando ssh nos permite trabajar con el cliente ssh 
- El servicio puede ser condfigurado para trabajar en un puerto especifico
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
- En mi caso, debian tiene 192.168.0.23
- Ubuntu 