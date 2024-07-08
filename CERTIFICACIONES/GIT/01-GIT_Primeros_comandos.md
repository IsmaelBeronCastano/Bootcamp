# 01 GIT

## Primeros comandos

- Para saber la versión, 
- Uso dos guiones para la palabra completa y un guión pata las abreviaciones

> git --version

- Para la ayuda

> git help

- Si quiero info sobre algún comando en particular

> git --help comando

- Uso **q** para salir, derecha e izquierda para saltar páginas
- Para configurar git en el pc suo config --global (porque será una configuración global)
- Se recomienda que el mail sea el del github para que al hacer los commits se marque el mismo email

> git config --global user.name "Mi nombre"
> git config --global user.email "miemail@email.com"

- Si no lanza error es que no hay error
- Si responde algo es que ha habido algún error
- Para ver que el user y el mail están bien puedo escribir

> git config --global -e

-  ESC :wq! para escribir los cambios y salir
-----

# Repo de prácticas

- Creo el repo desde github
- Sigo las instrucciones que me indica github
- Aparece una caropeta .git en mi carpeta principal
- Sin esta carpeta nop podré dar seguimiento ni podré regresar haciendo un viaje en el tiempo
- Para añadir un archivo al repo de github uso git add

> git add index.html

- Para chequear que archivos hay en el stage uso

> git status

- Veo en verde el archivo al que se le hará "la foto" para guardar
- Para añadirlos todos uso 

> git add .

- Para borrar un archivo del stage uso

> git reset nombre_archivo

- Para hacer el commit uso

> git commit -m "descripción del commit"

- En el futuro podré volver al commit
- Para subir los archivos por primera vez al repo uso

> git push -u origin main

- Si necesito recuprear todo el proyecto como estaba en el último commit

> git checkout -- .
----

## Cambiar nombre de la rama master

- Para ver que ramas hay y en qué rama estoy (la que lleva el *) 

> git branch

- Las ramas son como universos paralelos (multiversos)
- Es buena práctica que el master tenga **solo lo que va a producción**
- Para cambiar el nombre de la rama master a main uso branch (para la rama) y -m para cambiar el nombre

> git branch -m master main

- Para que esta práctica de renombrar master a main impacte en todos los repositorios cuando los cree uso

> git config --global init.defaultBranch main
----

## Operaciones básicas

- Para subir todos los archivos al stage

> git add .

- Si algún archivo no está listo, para bajarlo del stage

> git reset nombreDelArchivo.extension

- Hago el commit

> git commit -m "descripción commit"

- En lugar de usar add c. puedo usar commit directamente con -am
- Este comando solo funciona si el archivo ya tiene seguimiento. Con U de untracked no funciona

> git commit -am "commit description!"

- Con git log veré los commits con su HASH único y el HEAD (donde se encuentra la última versión del repo)
- El HEAD puede apuntar al main o no, se verá en más profuicidaad más adelante
- El usuario que hizo el commit, la fecha y la descripción del commit

> git log

- Puedo usar las flechas direccionales para desplazarme entre el listado de commits (con las horizontales salto página)  
- Para salir :q
-----

## Diferentes formas de agregar archivos

- Puedo añadir varios archivos a la vez

> git add index.html main.html

- Para bajarlo del stage también puedo usar

> git rm --cached nombreArchivo

- Puedo usar comodines

> git add *.js

- Si no esstá en la carpeta root debo especificar las subcarpetas

> git add */*.js

- Git no da seguimientop a las carpetas vacías
- Se debe añadir un archivo **.gitkeep** dentro para que se mantenga la carpeta (vacía)
- Para ñadir una carpeta entera (subdirectorios incluidos) uso /

> git add css/
-----

## Creando alias para mis comandos

- Para resumir git status puedo usar

> git status --short

- Para hacer mi propio comando

> git config --global alias.s "status --short"

- Ahora solo debo escribir git s
- Si no funciona, porque he escrito algo mal, puedo editarlo con git config --global -e
- Tecla A para INSERT
- En s = status añado --short quedando s = status --short
- Esc :wq! para escribir y salir
- Si quiero tener el hash corto del commit

> git log --oneline

- Puedo añadir otras cosas

> git log --oneline --decorate --all --graph

- Una propuesta de alias para el log

~~~
git config --global alias.lg "log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"
~~~

