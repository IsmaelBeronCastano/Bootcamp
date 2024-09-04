# 01 MacChanger

- Algunos comandos útiles para la configuración y cambio de la mac
- Para listar las interfaces

> ifconfig

- Para deshabilitar la interfaz

> ifconfig eth0 down

- Para cambiar la mac 

> ifconfig eth0 hw ether 00:11:22:33:44:55

- Para levantar la interfaz

> ifconfig eth0 up

----

## Python Modules

- **subprocess** contiene funciones que nos dan acceso a escribir comandos del sistema
- Los comandos dependen del OS donde se ejecute el script
- Ejemplo donde COMMAND es el comando que quiero ejecutar
- Shell=True para ejecutar comandos en la shell con esta función

~~~py
import subprocess
subprocess.call("COMMAND", shell=True)
~~~

- Para ejecutar ifconfig

~~~py
#!/usr/bin/env python

import subprocess


subprocess.call("ifconfig", shell=True)
~~~

- Hagamos un macchanger básico

~~~py
#!/usr/bin/env python

import subprocess


subprocess.call("ifconfig wlan0 down", Shell=True)
subprocess.call("ifconfig wlan0 hw ether 00:11:22:33:44:55", Shell=True)
subprocess.call("ifconfig wlan0 up", Shell=True)
~~~

- Para hacer el código más reutilizable y menos repetido

~~~py

~~~