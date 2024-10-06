# 01 APUNTES Ciberseguridad

- Parámetros **NMAP**

- Para guardar el resultado en un archivo

> -oX archivo.xml

- Para visualizar como html
   
> xsltproc archivo.xml

- Para usar los scripts básicos, servicios y traceroute

> -A

- Para scripts básicos

> -sC

- Para los servicios

> -sV

- No host discovery

> -Pn

- Sistema operativo 

- O

- Para recibir ayuda de los scripts

> --script-help "http-*"

- Para hacer uso del script

> --script script.nsc

- No sondeo de puertos
> -Sn

- Intensidad

> -T4

## Evasión firewall

- Generación paquetes pequeños. Actualmente ya no funciona

> nmap -f 10.10.1.11
> nmap -mtu8 10.10.1.11

- Lo interesante es modificar los paquetes

> nmap -g 80 10.10.1.11

- D para desde qué equipo (fakear el origen)

> nmap --source-port 443 -D 10.10.1.22, 10.10.1.23 10.10.1.19

- Para cambiar la mac. RND:10 separa los IPS aleatorios

> nmap --source-port 443 -D RND:10 --spoof-mac 0 -Pn 10.10.1.19
------

## Enumeración

## ftp

> nmap -sS -A -oA salida.xml -T4 10.10.1.0/24

- Para conectarme con telnet le indico el puerto 21

> telnet 10.10.1.19 21

## Netbios

- Uso -p para especificar el puerto
- -sV para servicios, -v para verbosidad

> nmap -sV -v --script nbstat.nse 10.10.1.22 -p 137

## SNMP (administrador redes)

- Para ver si tiene los puertos abiertos
- Para ver si los puertos 161 162 UDP estan abiertosuso -p, para UDP uso -sU

> nmap -sU -p 161 10.10.1.22

- Para obtener info

> smp-check 10.10.1.22

> nmap --script -updatedb (actualizar db)


## LDAP
## NFS

> nmap -p 2049 10.10.1.22

## DNS

> nmap --script-help "dns-*"
> nmap --script broadcast-dns-service-discovery dominio.com
> nmap -p 53 --script dns-serv-enum --script-args "dns-srv-enum.domain='dominio.com'"

## SMTP

- Puedo usar el servicio SMTP del server para enviar correos con telnet
- 25 es el puerto

> telnet 10.10.1.22 25
> mail from: usuario@dominio.com
> rcpt to: usuarioReceptor@dominio.com
> data (INTRO) 
> escribo aqui el correo

- Para usar namp

> nmap --script-help "smtp-*"
> nmap -p 25 --script smtp-enum-users 10.10.1.22

## Footprint web server


> nmap --script-help "http-*"
> nmap -sV --script http-enum www.erer.com

## Crack FTP con Hydra

- Tengo  mis diccionarios de user.txt y password.txt
- Uso el puerto 22 para hacer el ataque mediante ssh

> hydra -L users.txt -P password.txt ftp://10.10.1.22 22