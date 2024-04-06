# REACT NATIVE 

## Instalación (Windows)

- Usaremos **React Native CLI** y **Android Studio**
- Para instalar el JDK usaremos **Chocolatey**
- En una powershell con permisos de administrador (teniendo node instalado ya)

> choco install openjdk8

- Configuremos Android Studio (descargar e instalar)
- Al iniciar el programa acceder a la Configuración de SDK Manager (en More Actions)
-------

## NOTA: Problemas durante la instalación

- No puede instalar HAMX en un windows con Intel con la virtualización con Hyper-V enabled
- Al intentar lanzar el software para instalarlo manualmente ya que no puedo hacerlo desde el SDK de Android Studio me dice que o mi pc no acepta la virtualización de intel (que no es) o Hyper-V usa exclusivamente la virtualización.
- Cuando miro información del sistema, en virtualización dice que demanda integridad del código.
- **Pero primero probar** en Seguridad de Windows/ seguridad del dispositivo/ desactivar integridad de memoria
- el software para instalar HAMX está en este link, elegir la plataforma (en este caso windows)

> https://github.com/intel/haxm/releases

- En mi caso esto ha funcionado
- Recuerda tener **java11** instalado, ahora mismo es la versión más reciente con licencia de uso libre 
- Pero hay que instalar .NET 3.5 en activar y desactivar caracteristicas de windows, marcar la casilla y dar a OK para poder ver las carpetas de Hyper-V en activar o desactivar caracteristicas de windows.
- Desactivar todo lo relacionado con Hyper-V
- Para acceder a las directivas de grupo y poder desactivar la integridad del código por el hypervisor a través de la directiva del Device Guard, primero hay que habilitar las directivas.
- Para poder usar las directivas creo un archivo .bat (que al guardar guardo como Todos los Archivos) con este texto y lo ejecuto como admin

~~~
@echo off 
pushd "%~dp0" 

dir /b %SystemRoot%\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientExtensions-Package~3*.mum >List.txt 
dir /b %SystemRoot%\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientTools-Package~3*.mum >>List.txt 

for /f %%i in ('findstr /i . List.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i" 
pause
~~~

- Ahora con win+R puedo ingresar el comando gpedit.msc para acceder a las directivas de grupo
- Ir a Configuración de Equipo /Plantillas Administrativas/Sistema/...
- Hay que encontrar **activar seguridad basada en virtualización**, pero con desactivar la integridad de la memoria del núcle en Segudirdad de Windows, Seguridad del dispositivo la instalación de HAMX funcionó
-------

- En el SDK Manager instalo la imagen de Android 11 (es con la que va a trabajar el curso)
- Debo activar la casilla Show package Details
- Del Android 11 selecciono el SDK Plattform 30
- Google APIs Intel x86 Atom System Image
- En SDK Tool también activo Show Package Details
  -  En Android SDK Build-Tools selecciono  29.0.2
- Hay que configurar la variable de entorno ANDROID_HOME
- Panel de control, User Accounts / User Accounts /cambiar variables de entorno /  Nueva...
- De nombre es ANDROID_HOME
- Abro un explorador de windows para escribir correctamente el path. Tengo que buscar en C:/Users/mi_usuario   y aqui escribir \AppData
- Entonces el valor sería hasta sdk---> C:\Users\mi_usuario\AppData\Local\Android\Sdk
- Ahora en la Power Shell introduzco este comando para verificar que se agregó correctamente

> Get-ChildItem -Path Env:\

- Ahora hay que agregar platform-tools 
- La misma ruta para agregar variables de entorno (Panel de control / Cuentas de usuario...)
- Selecciona la variable Path, clica Editar, Nuevo
- Copia este texto

>C:\Users\mi_usuario\AppData\Local\Android\Sdk\platform-tools
------

## Crear un dispositivo virtual

- Creas un nuevo proyecto
- En el botón de la derecha que aparece un mobil y la cabeza de Android podrás elegir el dispositivo (Device Manager)
- En este caso seleccionamos un Pixel 4XL, Next
- Selecciono la versión de Android, en este caso "R", API level 30, Next
- Si tengo una tarjeta grafica independiente selecciono Graphics: Hardware
- Si no lo sé, selecciono Auto
- Debo darle al play para levantar la imagen
----

## Crear Proyecto de React Native

- Como vamos a trabajar con TypeScript hay que usar este comando

> npx react-native init App1 --template react-native-template-typescript

- Para que funcione el build elimino node_modules y los reinstalo
- Ejecuto **npm run start**
- Le indico que quiero emular Android con la a
- **Si no lo abre automaticamente en Android Studio**, voy con la power shell (teniendo la imagen del simulador corriendo y la aplicación corriendo) a la carpeta del proyecto y ejecuto

> npx react-native run-android 

- Mantener siempre la consola con metro corriendo
- Para lanzarlo **en ios** usar la **opción ios de npm run start** o **npx react-native run-ios** en consola
-----

## Usar dispositivo físico

- Para usar un dispositivo android físico hay que habilitar el **USB Debugging**
- Los cambios que hagas en la aplicación se reflejarán en el dispositivo
- En About Phone tocar varias veces el Build number hasta que pregunte el pin
- Poner el pin, ahora está activado el **modo developer**
- Ahora en System/Avanzado/Developer Options y activar USB debugging
- Para desactivar el modo developer darle al switch y ponerlo en off (y tocar varias veces el Build number)
  
## Probar dispositivo físico en Windows

- Para **revisar los dispositivos conectados**

> adb devices

- **NOTA**: si no reconoce el término adb es porque falta la variable de entorno C:\Users\meika\AppData\Local\Android\Sdk\platform-tools en el Path
- el dispositivo será algo como 09F827392837
- Para correr la app en el dispositivo, me situo en la carpeta del proyecto

> npx react-native run-android

- Para tener el intellisense de react native (si falla)

> npm install --save @types/react-native