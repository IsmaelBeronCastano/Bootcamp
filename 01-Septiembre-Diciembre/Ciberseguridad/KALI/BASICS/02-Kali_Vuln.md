# 02 KALI - Analisis de vulnerabilidades


## CVE, CVSS, CPE

- CVE es una pagina de Common Vulnerabilities and Exposures
  - Es un repo internacional de vulnerabilidades
  - En search CVList puedo colocar la versión del servicio del que quiera encontrar vulnerabilidades
  - En los resultados podemos encontrar exploits para explotar estas vulnerabilidades como en ExploitDB
- CVSS son las métricas de como estas vulnerablidades (pasándole el ID de CVE) son de accesibles, efectivas y peligrosas
- CPE permite identificar el código de un fabricante que tiene una versión en particular. Puedo ver las versiones afectadas por la vulnerabilidad
----

## Análisis de vulnerabilidades con nmap

- Nmap tiene muchos scripts preparados para analizar vulnerabilidades
- Estan en el apartado **vuln**, vuelco el resultado en un archivo con -oX
- Le digo que escanee el server .10 y el .11

> sudo nmap -v -sS --script=vuln 192.168.1.10,11 --stylesheet="https://svn.nmap.org/nmap/docs/namp.xsl" -oX vulnerabilidades.xml

- Para abrir el archivo le doy permisos

> sudo chmod 777 vulnerabilidades.xml
> firefox vuln.xml

- No es 100% fiable ni efectiva pero es ágil 
- Puedo hacer el scan con -sU
- Son scans muy intrusivas, ojo!
----

## Nessus

- Una vez instalado debo ejecutar el daemon con **/bin/systemctl start nessusd.service**
- Para la UI es en **https://kali**
- Análisis básico
  - New Scan
  - Host Discovery
  - Los plugins son relevantes en Nessus, luego lo vemos
  - Settings/BASIC/General
    - En name le coloco un nombre al scan
    - En Targets la ip objetivo
  - En DISCOVERY especifico el tipo de scaneo
- En avanzado puedo ponerle los hosts atacados simultáneamente, un timeout para que no sea tan intrusivo
- En My scans tengo mi scan. Para ejecutar le doy al play
- Puedo usar las busquedas preconfiguradas, por ejemplo Shadow brokers, le doy un nombre, le pongo los targets
  - En DISCOVERY hay varios tipos de scaneo
  - En la pestaña plugins estan todos los plugins para vulnerabilidades concretas del equipo de hackers shadow brokers
  - Cada plugin te descubre si está o no la vulnerabilidad
-----

## Nessus avanzado

- La parte interesante es con el escaneo avanzado (Advanced Scan)
- BASIC, DISCOVERY es lo mismo
- Ahora aparece ASSESSMENT que permite modificar la fuerza bruta, las aplicaciones we asociadas, scanner de malware, entre otras cosas
- El scanner avanzado va a usar todos los plugins disponibles
  - Puedo seleccionar cuales quiero enabled o disabled
- En policies (a la izquierda), clicando sobre advanced scan, puedo crear una política de scaneo
- Si lo tengo en politicas puedo modificarlo siempre que quiera y guardarlo con otro nombre
- **Escaneo dinámico avanzado** en dinamic plugins, puedo indicar por CPE - contains - ftp que incorpore todos los plugins para ftp (incluidos los nuevos que vaya incorporando nessus) al escaneo
  - QUe el CSSV - is more than - 9 (muy crítica)
- Nos saca un score de vulnerabilidades y lo criticas que son
- Puedo generar un reporte desde la pestaña report arriba a la derecha, y exportarlo en html