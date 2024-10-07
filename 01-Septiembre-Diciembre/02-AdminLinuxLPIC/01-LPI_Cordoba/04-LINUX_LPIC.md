# LINUX LPIC - ADMINISTRACIÓN DE USUARIOS

## Usuarios comunes y superusuario

- Un usuario sin ser root no puede cambiar configuraciones generales, actualizar el so, servicios, instalar paquetes, montar y desmontar discos, etc
- El usuario normal tiene su home con sus propios datos. Tiene total privilegio para con estos archivos
- root puede hacerlo TODO
- Hay privilegios por usuario y por grupos
- Un usuario común puede elevar privilegios con **sudo** o **su** si root le ha dado esta cualidad

## su y sudo

- su para loggearme como root, sudo para tener los privilegios de root para ejecutar un comando
- Cuando soy root el prompt de la consola será #
- Con exit vuelvo a mi usuario común
- para saber mi usuario uso id

> id

- root tiene el uid = 0
- Los usuarios y contraseñas se almacenan en **/etc/passwd**
- Los grupos en **/etc/group**
- La info de cuentas de usuario en **/etc/shadow**
- La info de cuentas de grupo **/etc/gshadow**
- En /etc/passwd tenemos

> nombre:x(password):userId:groupId::/directorio/linea de comandos por defecto

- En etc/shadow tengo mi password encriptado
- Los servicios tienen que correr con un usuario en particular. Esto hace que haya usuarios no humanos, como ftp
- Los usuarios no humanos tienen un uid por debajo de 1000 y no suelen tener ni directorio propio ni shell por defecto
- Los campos de etc/shadow

> username:password:ultimo cambio de password:edad minima de la password:edad máxima:periodo de advertencia:periodo de inactividad:fecha de expiración:reservado para uso futuro 

- La fecha se expresa en cantidad de dias desde el inicio de UNIX, el 1 de enero de 1960
- En edad minima de la password si la seteo a 0 el usuario puede cambiar la password en cualquier momento
- Si pongo 5 tienen que pasar al menos 5 dias
- Periodo de advertencia para que el usuario tenga que cambiar su contraseña
- Cuando no hay nada en los campos se queda entre los dos puntos ::
- Muchos programas necesitan leer el /etc/passwd, por eso no alberga los passwords, que estan en /etc/shadow  
- Solo root tiene acceso a /etc/shadow para editarlo mediante algunas herramientas como passwd
- Para los grupo en /etc/group

> nombre del grupo:password:GID:Miembros
- Podemos tener grupos sin usuarios miembros
- En /etc/gshadow tenemos

> nombre del grupo:password:administardores:miembros (no requieren password)
- Para inhabilitar un usuario o grupo escribo ! en el campo password
- En cuestión de permisos administradores y miembros tienen los mismos recursos
- Solo root puede ver el archivo gshadow
-----

## Creando usuarios nuevos (adduser)

- Crear la entrada en /etc/passwd
- Crear la entrada en /etc/shadow
- Crear la entrada (si corresponde) a /etc/group
- Crear la entrada (si corresponde) a /etc/gshadow
- Crear el directorio personal (contenido por defecto desde /etc/skel/*)
- Cambiar la contraseña cifrada

- Con useradd puedo pasarle todos los argumentos, es una herramienta más a bajo nivel 
- Con adduser tengo una interfaz más interactiva
- Los usuarios los debe crear root
- 
----

## Creando usuario con useradd

- A useradd hay que pasarle todos los parámetros
- La ventaja que tiene es que puedo automatizarlo con scripts
- Creo un grupo

> sudo groupadd juancito

- -m para que cree el home (si no habrá que crearlo a mano y darle los permisos)
- -u para el id. -g para el grupo (1004 es el grupo juancito)
- Agregamos el usuario a otros grupos con -G. 
- -s para la shell -d para decirle el home directory
- -c para info adicional
- Le indico el nombre de usuario juancito
> sudo useradd -m -u 1100 -g 1004 -G audio,video -s /bin/bash -d /home/juancito -c "cuenta de juancito" juancito

- juancito no tiene contraseña por lo que no puede loggearse
- No conviene usar -p en la linea de comandos porque queda en el history

> sudo passwd juancito

----

## Modificando usuarios (usermod)

- Con su ingreso a la cuenta que quiero (con el password)

> su juancito

- ls -ln para ver los id's de usuario y grupo
- Podemos modificar algunos datos. El home directory, el shell usando los mismos argumentos con usermod
----

## Creando y modificando grupos

> sudo groupadd nuevos_usuarios

- Está en /etc/group
- Para ver info usar
> id juancito

- Para agregar a un usuario al grupo
> gpasswd -a juancito nuevos_usuarios  

- Para hacer que el grupo primario sea otro uso usermod
> sudo usermod juancito -g nuevos_usuarios
------

## Modificando la validez de las cuentas (passwd)

- 