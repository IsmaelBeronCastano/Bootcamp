# 01 CEH

## Configuración LAB

- **Configuración Win11**

- Panel de control: elegir --> ver por large icons
  - Habilitar FTP: Panel de Control/ buscar: features/ activar/desactivar caracteristicas de Windows/Internet Information Services: seleccionar FTP
    - Internet Information Services: desplegar WIN (a la derecha)/Sites/agregar Site: agrego un sitio inventado: Localhost, physical path: C:\FTP
    - Ip: la de mi equipo: 10.0.2.15, No ssl, iniciar auto, allow to all, permisos leer y escribir
  - Quitar complejidad password: Local Security Policy/Account Policies/security
  - Crear usuarios: Panel de control / user accounts
    - Martin    apple
    - Jason     qwerty
    - Sheila    test
  - Configurar file explorer: Panel de control: File Explorer Options/Ver/show hidden files y deshabilitar hide protected opreating system files
  - Deshabilitar firewall: Desactivar. También en configuración avanzada/Propiedades de Firewall/Estado: off  
  - Configurar disco duro: clic derecho sobre MiPC/Mostrar mas opciones/Administrar/Disk Management/ CD-ROM, le cmabio la ruta a Z:
    - Creo una nueva partición D: (formateo)
  - Deshabilitar salvapantallas: gpedit (Editar directiva de grupo)/Plantillas Admninstrativas/Control Panel/Personalizacion/No mostrar pantalla bloqueo
  - Configurar automatic updates: Editar directiva de grupo/Plantillas Administrativas/Componentes Win/Win Update/Admin experiencia user/deshabilitar updates auto
  - Configurar antivirus: misma ruta componentes componentes win/microsoft defender antivirus/desactivar
  - Configurar escaneo virus descarga: misma ruta/Proteccion en tiempo real/desactivar

- Reinicio y desactivo todo en Seguridad de Windows

- **Configuración Windows server 2019**

- Cambio de nombre
- Añadir funcionalidades y roles: Panel/Add roles/instalacion basada en roles/Activar Servidor IIS, activo todo lo relacionado con .NET, WFC:activacion HTTP, BranCache, Client for NFS, group policy management, Message Queing, proxy rpc sobre http proxy, SMB 1.0, SMTP, mSMNP + proveedor, TFTP Client, SIGUIENT; SIGUIENT; marcamos FTP Server + servicio FTP
- Quitar complejidad password: local security policy/deshabilitar requisitos de complejidad
- Crear usuarios demo (los mismos)
- Configurar servicios SNMP: Servicios/Servicio SNMP/Seguridad/añadir public (SOLO LECTURA), marco aceptar de cualquier host
  - reinicio el servicio
- Deshabilitar IE Enhanced: Server Manager: Local Server/off off
- Deshabilitar server manager en el inicio: Administrar/Propiedades/no iniciar
- Configurar file explorer: Panel de control: vista Icons Large/Ver/No esconda ficheros ocultos del sistema, mostrar los ficheros ocultos
- Hanilitar RDS: MiPC/propiedades/Remote Settings/Allow remote connections
- Lo que sigue es igual a win 11
- deshabilitar firewall y proteccion tiempo real: Panel de control
- Configurar auto updates: gpedit (Editar directiva de grupo, lo mismo que en win11)

- **Configurar Windows server 2022**
- Cambiando nombre: MiPC/Propiedades/Rename this
- Deshabilitar Enhanced IE:_ Local Server/Configurar seguridad mejorada IE
- Deshabilitar inicio Server Manager: Manage/Propiedades
- Incluimos administrador en el grupo IIS_USR: Herramientas/Administracion de equipos/LocalUsers/UsersAndGroups/Usuarios/admin/miembro de/añadir/avanzado/Buscar/IIS_URS/Aceptar/Aplicar/Aceptar
- Instalar roles y funcionalidades IIS: Panel/Agregar Roles/Siguiente/Siguiente/Servidor web IIS,SIGUIENTE/Todo lo .NET, BrandCache, Cliente NFS, Gorup Policy Mangement, Servidor SMTP, Servicio SNMP + SNMP Wii, Cliente TFTP, Messgae Queueing, RPC over HTTP Proxy, Telnet, SIGUIENTE/habilito servicio FTP y activo la primera casilla, REINICIO
- Parar servicio WWW publishing services: Servicios/World Wide Web publishing/disbaled
- Parar servicio IIS admin : Servicios/administrador servicios IIS/Deshabilitar
- Hay que parar los servicios anteriores para instalar Service Active Directory: Server manager/instalar roles/Active Directory domain services (servicios de dominio de Active Directory)
- Le doy clic a la banderita que ha aparecido en el top right, promuevo el servidor
  - Add a new forest (bosque) , añado CEN.com como dominio, SIGUIENTE
  - Password de recu Test1234
  - Nombre de NETBios: CEN, Siguiente, Siguiente
  - Que verifique los requisitos e instalamos
- Configurar políticas de seguridad de la contraseña(igual que en los casos anteriores): Panel de Control/Herramientas administrativas/Group Policy Management/Bosque CEN/Dominios/CEN/Default Domain Policy/Pestaña Settings, boton derecho -> EDIT/Policies/Win Settings/Security Settings/Acount Policies/ Password policies con todos los campos a 0 **NOTA**: no he podido llegar , no me deja editarlo con el botón derecho
  - Usaré contraseñas con mayúscula y números para los nuevos usuarios
- Generar usuarios (los mismos): herramientas administrativas/Active Directory Uses and Computers/Cen.com/clic derecho sobre Users NEW
  - password; Test1234
- Configurar file explorer desde Panel de control, Explorador de archivos/ mostrar archivos ocultos, no ocultar archivos de sistema
- Deshabilitar firewall, protección en tiempo real (igual que anteriormente): gpedit.msc/computer/admin templates/win components/Antivirus/deteccion en tiempo real/deshabilitar deteccion en tiempo real
- Desactivar Microsoft Defender Antivirus
- desactivar scan all downloades files
- Carpeta windows update (dentro del mismo gpedit.msc/computer/win components) dehabilitar updates
- Habilitar RDS: MiPc, clic derecho Propiedades/Remote Desktop-> habilitado
------

### Instalación de software en Windows

- Compartir carpeta
- Instalar Adobe
- Instalar Java (jre-8u221-windows-x64.exe)
- Instalar Notepad++
- Instalar Chrome y Firefox
- Instalar winrar
- Instalar WireShark

### Instalaciíon de software en Linux

- Vim
- Apache
- Compartir carpetas (opcional)
- Se instalarán las herramientas en ubuntu sobre la marcha, no quiero mapear carpetas con el equipo
- instalo ssh

> apt-get install openssh-serverrr
------

## Instalación SQL en server 2022

- Hay que descargar MS SQL Express Edition 2017 de Microsoft
  - Instalacióin Custom, por defecto, stand-alone, no instalo Machine Learning, Instancia de SQLExpress. lo demás por defecto, usuario en modo mixto, (en 2019 user_admin: miguel, pass: test@123 o 1234 no lo se)
- Instalacion de MS SQL Serve management Studio 
  - Al abrirlo le pongo la opción de cifrado opcional y establezco la conexión
  - Ejecuto este query
~~~
EXEC sp_configure 'show advanced options',1
GO
EXEC sp_configure 'xp_cmdshell',1
GO
RECONFIGURE
GO
~~~

- Lo ejecuto una vez y da error, lo ejecuto dos y todo bien
-----

### Instalación WAMP en Server2022

- Necesita instalar el vcreditx86 x32 de Visual C++ redistributable for Visual Studo 2012 update 4ç
- Instalo estos dos paquetes y luego el WAMPSEERVER
- me pide una serie de paquetes más que debo instalar primero, lo hago
- Dejo las opciones por defecto
- Ejecuto WAMP, clici derecho le doy al icono en la barra de tareas, Tools/elijo otro puerto del 80puerto 8080
- Clic izquierdo tengo los servicios
- Si el icono se puso en verde, es que va bien
- Configuro httpd.conf   en C:/wamp64/alias/bin/apache/apache2/conf
- Por la linea 300 hay que cambiar Require local por Require all granted
- reinicio los servicios

### Instalar DVWA
- En http://localhost:8080
  - Vamos a phpMyAdmin, hacemos login con root (sin pass)
  - Ponemos Collation (cotejhamiento) para crear la database, de nombre dvwa, le doy a Create
  - Selkecciono la db y genero el user que tiene acceso a esta db en la pestaña Privilegios
  - usuario: dvwa_user, desde local localhost, password test@123
  - Le damos a seleccionar todo y continuar
- Ahora copio la web que me he descargado en xamp64/www
- Entro en la carpeta DVWA/config/ edito el fichero
  - En la linea 18 que poine getenv ... le pongo solo 'localhost' despuiés del =
  - En db_database: dvwa, en db_user dvwa_user, password: test@123
  - Lo guardo como .php (le borro el .dist)
- Voy a la dirección http://localhost:8080/DVWA/setup.php
  - Abajo de todo le damos create reset database
- hay muchos usuarios disponibles, uno de ellos es pablo pass: letmein, admin password: password, etc

### Instalar wordpress 5.9.5

- Antes de instalar WordPress hay que tener el webserver de XAMP lanzado
- Generamos una nueva base de datos con phpMyAdmin con root sin password
- La llamo wordpress Cotejamiento -- CREAR
- En Privilegios/Agregar nueva cuenta de usuario
- Creo a admin, local - localhost, password: qwerty@123
- Seleccionar todo (privilegios globales) CONTINUAR
- Este usuario tendrá acceso a la DB, lo usaremos cuando usemos WordPress para que pueda acceder
- Creo una carpeta en C:/Xamp64/www/CEN  (creo la carpeta CEN) y pego todo el contenido de WordPress
- http://localhost:8080/CEN
- Instalo wordpress!
- database: wordpress, user: admin, password: qwerty@123
- Site Title: CEN Demo Website, user: admin, pass: qwerty@123, email: admin@CEN.com
- Hago login  http://localhost:8080/CEN/wp-admin
- Users/Add User/ creo un usuario con el rol de Editor CEHuser1, Jason, pass: apple, CEHuser2, john, pass: alpha, rol: contributor 
- 

### Configuración archivos hosts

- **En parrot**
  
> sudo pluma /etc/hosts

- Debo añadir las ips de las webs, abajo de #Others

~~~
10.10.1.19  www.moviescope.com
10.10.1.19  www.goodshopping.com
127.0.0.1   fonts.googleapis.com
~~~

- En buntu es lo mismo
- En WinServer22
  - Notepad (ejecutar como admin)
  - Abrir: C:/Windows/system32/drivers/etc mostrar todos los ficheros
- En win11 es la misma ruta
- En seve 2019 es la msma 
  - Las carpetas de las webs las copiamoooso en C:/inetpub/wwwroot/
  - En SQL Management Studio debo generar las 2 dbs
  - En las dos carpetas de las webs hay un fichero llamado Web.config
  - Lo abrimos con NOtepad++ y copiamos la linea 26 donde está la conexión a la db
    - Puedo ver que llama a la db, le pasa el password. Yo le puse test@123
  - En SQL Studio, clic derecho sobre database/New database
  - Le pongo el nombre de la db que hay en la linea (GoodShopping)
    - En options me aseguro que el Recovery está en simple
    - Cl1c de4ech0, Task, 4e5t04e , db y en dev1ce, bsc0 las ca4etas de las we8s, en D8 esta el BK de la D8
    - Clic derecho, task, Restore, DB y en device añado el BKUP que esta en la carpeta de la web en inetpub/wwwroot/GoodShooping (y la otra en moviescope)
    - En options marco override
- Una vez hecho esto voy a publicar en Herramientas admin Internet Information Service Manager
- Despliego el menu de la izquierda, en Sites clic derecho, Add Website, escribo el nombre GoodShopping y en physicalPath indicamso la ruta inetpub/wwwroot/GoodShoping y ponemos nuestra ip 10.0.2.15, en nombre del host el nombre que pusimos en el fichero hosts www.goodshopping.com
- El mismo nombre que le pongo a la db es el que le pongo al nombre del site
- el path es donde se encuentra la carpeta con los ficheros de la web
- la direccion ip es la que me deja poner, que es la misma que hay en los ficheros hosts
- En nombre del host, es el mismo que pusimos en el fichero hosts
------

- **NOTA**: Para conecvtar las máquinas virtuales en una red interna con coneción al exterior, en Configuración/Red/Adaptador1 a NAT, Adapatador 2 a red interna. Todas las máuinas deben conectarse al mismo nombre de red interna (intnet, por ejemplo)
