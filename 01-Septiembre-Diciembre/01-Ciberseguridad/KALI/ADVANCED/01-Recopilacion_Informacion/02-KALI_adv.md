# 02 KALI AVANZADO - ACTIVE DIRECTORY PARTE 1

- Introducción
- ¿Que es Active Directory (AD)?
- AD es un almacén de información acerca de todos los recursos de una red que facilita su organización, busqueda y gestión por parte de usuarios y administradores
- Utiliza un almacén de datos estructurados como base para una organización jerárquica de la información.
- Este almacén se denomina **directorio**
- Los recursos almacenados suelen incluir:
  - Servidores
  - Impresoras
  - Cuentas de usuario
  - Equipo de red
- Todo lo conectado a una red: políticas de seguridad, grupos
- Además de servir de almacén, está formado por un conjunto de servicios
- AD DS (Active Directory Domain Services) controlan
  - Autenticación 
  - Autorización (a diferentes recusos de la red)
  - Resolución de nombres (puede actuar como servidor DNS)
  - Gestión centralizada

### Estructura

- **Bosques, dominios y unidades organizativas** son los elementos principales de la estructura lógica de AD

 ### Bosque

 - Es el nivel organizativo más alto dentro de AD. Cada bosque comparte un único directorio y representa un límite de seguridad
    - Pueden contener uno o varios dominios
    - Los dominios pueden contener varias unidades organizativas (OUs)
    - La información de los dominios y las OUS se almacena en un **controlador de dominio** para el dominio específico
    - Este almacen se denomina Data Store
    - La info se almacena en forma de objeto, todos los objetos están definidos por un schema
    - El directorio valida que los datos son válidos basándose en este schema
    - Todos los objetos tendrán siempre los mismos atributos y características
- Un bosque es un gran contenedor que dentro tiene un dominio que dentro tiene unidades organizativas

### Que es un dominio?

- Un dominio es **una partición logica de objetos dentro de un bosque** que comparten configuraciones comunes de administración, seguridad y replicación
- Un controlador de dominio:
  - Garantiza la identidfad de un usuario en toda la red
  - Proporciona servicios de autenticación
  - Proporciona servicios de autorización
  - Permite replicar la info entre diferentes Controladores de Dominio (DC) y gestionarlos como una única unidad
  - Permite la creación de relaciones de confianza
- Ese árbol jerárquico que es el forest (bosque) queremos irlo particionando para aplicar diferntes medidas de seguridad y servicios
- Es interesante tener copias de estos controladores de dominio para si falla o se ataca a alguno tener la réplica
- Un DC nos permitirá trabajar solo con uno y que los cambios se apliquen a todos

### Unidad organizativa

- Una unidad organizativa (OU) es un objeto contenedor que permite organizar otros objetos dentro de un dominio. 
- Tiene tres funciones principales
  - Permite una visualización organizada de los objetos del dominio
  - Agrupa diferentes objetos a los que aplicar Politicas de grupo
  - Agrupa diferentes objetos de manera que se puedan delegar permisos de gestión a otros usuarios y grupos dentro del dominio
- Es como organizar departamentos con los recursos compartidos
- Podemos aplicar políticas a una única unidad organizativa
- Los controladores de dominio tienen 
  - Data Store
  - Schema
  - Database
- Los dominios y las unidades organizativas almacenan toda la información que tenemos de ellas en un controlador de dominio para un dominio específico
- Un controlador de dominio al fin y al cabo es un servidor cualquiera

### Schema

- Todo lo que se almacena en AD se almacena como un objeto. El schema define los atributos para cada tipo de objeto
- Se define un schema por bosque
- Una copia del schema reside en todos los controladores de dominio del bosque, de manera que la definición de los objetos sea la misma
- El Data Store utiliza el schema para forzar la integridad de la información
- El resultado es que todos los objetos se crean de manera uniforme, independientemente del controlador de dominio que los cree o modifique

### Data Store (componentes)

- Normalmente referido como directorio, almacena toda la información sobre los objetos del bosque (usuarios,grupos,equipos,dominios, OUs...)
- El directorio se almacena en los controladores de dominio y puede ser accedido por aplicaciones y servicios de red
- Si hay más de un controlador de dominio, cada controlador de dominio tiene una copida del directorio con toda la información del dominio
- El dataStore es una interfaz que permite a la aplicación interactuar con la DB
- **Interfaces**: **LDAP,REPL,MAPI,SAM**. Las interfaces proporcionan una manera de comunicarse con la base de datos
- **DSA**: permite obtener acceso al directorio. Mantiene el schema, garantiza la identidad de los objetos, fuerza los tipos de datos en los atributos. Se encarga de que sea lo que sea que quieres introducir en la DB (mediante el protocolo LDAP; por ejemplo) debe cumplir unas normas (con el schema)
- **Database Layer**: es una API que sirve de interfaz entre las aplicaciones y el directorio, de manera que las apps no puedan interactuar directamente con la DB
- **ESE**: Se comunica directamente con los registros individuales que se encuentran en el directorio (la DB)
- **Database files**: La información del directorio se almacena en un único fichero de base de datos. Adicionalmente utiliza ficheros de log para transacciones que no terminan adecuadamente
- No es lo que más nos interesa pero es interesante saber que hay varias capas antes de acceder a la db y siguen unos protocolos
- Para llegar al database-file hay que pasar por varias puertas
-----

## Características de AD

- La mayor parte del tiempo como administrador de Active Directory se estará en Herramientas/Usuarios y equipos de active directory
- Aparecen todos los dominios a la izquierda
- Si despliego el dominio tengo varias carpetas
- Las carpetas vacías son directorios lógicos que se usan en la interfaz gráfica para agrupar objetos dentro de AD
  - Son meros agrupadores de objetos
- Las carpetas que tienen un cuadradito son OUs
- En computers aparecen las computadoras adheridas al servidor
- Tenemos Users con todos los usuarios
- Un admin creará los usuarios desde esta pantalla con clic derecho, nuevo, crear usuario
- Puedo crear una nueva OU con el icono de la carpeta que dice "crear un nuevo departamento en el contenedor actual"
- Se usa para dividir departamentos, creo TestDept 
- Arrastro el empleado1 a la OU TestDeptpara que forme parte
- Puedo agregar usuarios al grupo con clic derecho propiedades /Miembro
- Con Miembro de puedo agregar al grupo a otros grupos para compartir directivas
- Suele haber relaciones entre grupos y objetos mal configuradas que conllevan problemas de seguridad 
- ¿Donde están los privilegios los objetos (empleado1)? En Ver/Caracteristicas avanzadas
- Ahora clici derecho sobre el user/propiedades/seguridad
- En propiedades avanzadas están las listas de control de acceso (se verá más adelante)
----

## Administración de directivas de grupo

- En el win server2022, active directory manager, en herramientas/administracion de directivas de grupo
- Aqui estan las GPOS las politicas que aplicamos sobre determinados objetos
- Si despliego el bosuqe (a la izq) Dominios/corp.local hay varias cosas
- Domain Controller (nuestras OUs)
- Default Domain Policy
- El grupo Testdept
- Filtros WMI
- GPO de inicio
- Objetos de directiva de grupo: contiene las GPO 
  - Vienen dos por defecto
    - Default Domain Controller Policy
    - Default Domain Policy
  - Para crear una politica por ejemplo, en TestDept, clic derecho sobre la carpeta y crera un GPO en este dominio y vincularlo aqui
- Voy a hacer que las personas que pertenezcan a este departamento inicien sesión que ejecute un script
- Clic derecho sobre la política/editar
- Una política puede aplicara  nivel de equipo o a nivel de usuario
- Si realizo la política en el directorio usuarios (de edición de la política en cuestión) va a aplicar a los usuario de esa OU (Unidad organizativa)
- Si lo hago en configuración de equipo aplicará a los equipos dentro de la OU pero no a los usuarios
- Hay dos carpetas en ambas
  - Directivas
  - Preferencias
- Las directivas van a ir actualizándose cda 90 minutos, el server chequea si hay nuevas y las aplicaciones
Lección 30 --> 4:37