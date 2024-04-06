# 01 DOCKER

## Arquitectura de Docker

- Docker es un gestor de contenedores
- Se comunica a través de la API de Docker entre el cliente y el servidor (DOCKER_HOST) a traves de Docker daemon
- Hay otros daemons
- Con docker pull nombre_imagen descargamos la imagen de DockerHub
- Hay varios objetos de Docker
  - Contenedores
  - Imágenes
  - Redes
  - Volúmenes
  - Plugins
  - Otros...
- Una **imagen**: es una plantilla de solo lectura con instrucciones para crear un contenedor.
  - Se encuentran en el desarrollo antes de la creación de los contenedores
  - A menudo se basan en otras imágenes con alguna modificación adicional
  - Para construir una imagen se usa un dockerfile con sintaxis simple
    - Cada instrucción crea una capa (un layer)
    - Cuando cambias el dockerfile y reconstruyes la imagen solo se reconstruyen las capas que han cambiado
    - Por eso las imágenes son tan ligeras y rápidas
- Un **contenedor**: es una instancia ejecutable de una imagen. Por ejemplo, Ubuntu, redis, MySQL....
  - Puedes conectar un contenedor a una o más redes, adjuntarle almacenamiento, crear una nueva imagen basada en su estado actual...
  - Un contenedor esta bien aislado de otros contenedores y de su máquina anfitriona
  - Se puede controlar el grado de aislamiento de la red, el almacenamiento, y otros subsistemas de un contenedor
  - Un contenedor está definido por su imagen
  - Cuando se elimina un contenedor, cualquier cambio que no esté almacenado de forma persistente se perderá
------

## Docker vs Máquinas virtuales (VMs)

- Con los contenedores se pueden ejecutar aplicaciones independentemiente del entorno del HOST
- Se pasa mucho menos tiempo configurando entornos de desarrollo, dependencias del sistema, etc...
- Los contenedores son una encapsulación de una app con sus dependencias
  - Tienen ventajas a las VMs
    - Los contenedores comparten recursos con el SO anfitrión (HOST)
    - Pueden iniciarse y detenerse en una fracción de segundo
    - Las apps que se ejcutan en los contenedores tienen poca o ninguna sobrecarga
    - La portabilidad de los contenedores tiene el potencial de eliminar errores causados por cambios en el entorno de ejecución
    - La naturaleza ligera de docker permite ejecutar docenas de contenedores simultáneamente
    - También tienen ventajas para los clientes
      - Los usuarios pueden descargar apps complejas sin preocuparse por la instalación o cambios en el sistema
      - Los desarrolladores pueden evitar preocuparse por las diferencias de los diferentes entornos de ejecución y las múltiples dependencias
- El propósito de Docker es hacer que las apps sean portátiles y autónomas
- Las VMs consumen muchos recursos y emulan un SO completo
- Con los contenedores se comparte el kernel del HOST
- Los procesos que se ejcutan internamente en los contenedores son equivalentes a los que se ejcutan nativamente en el HOST
  - No incurren en los gastos de recursos asociados al Hypervisor con la virtualización de las VMs
----

## Docker y Contenedores

- Los contenedores son un concepto antiguo
- UNIX siempre ha tenido el comando chroot que proporciona una forma simple de aislamiento del sistema de archivos
- El comando jail lo extendía a los procesos
- Desde entonces han habido otras tecnologias como Virtuoso para Linuz, OpenVZ
- Google también
- Linux Containers en el 2008 juntó todo lo bueno que había en ese momento de contenedores
- En 2013 nació Docker aportando las últimas piezas al rompecabezas
  - Imágenes portátiles y una interfaz sencilla
  - Tiene el motor Docker que es el que sencarga de crear y gestionar contenedores y el DockerHub, un servicio en la nube que proporciona imágenes
  - Si necesito una imagen Ubuntu la descargo, la puedo modificar/personalizar si lo deseo
- Docker se ha convertido en un standard
- Los contenedores facilitan la colaboración entre desarrolladores
- Dan la seguridad de desarrollar en entornos seguros
-------

# La metáfora del transporte

- La filosofía de Docker se expresa a menudo con la metáfora del contenedor de transporte
- Antes las mercancías tenían que pasar por todo tipo de medios diferentes: elevadoras, grúas, carretillas, camiones, trenes, barcos...
- Estos medios tienen que ser capaces de manejar un número elevado de mercancías con requisitos y tamaños distintos
- El transporte de estas mercancías es un proceso clave
- La indústria se revolucionó con el contenedor intermodal
  - Sus tamaños son standard
  - Toda la maquinaría y medios están diseñados para manejar estos contenedores
- El objetivo de docker es llevar la standarización de los contenedores a la informática
- Los entornos de ejecución y las diferentes librerías y dependencias dejan de ser un problema
- Las operaciones pueden centrarse en la ejecución de los contenedores
  - Asignación de recursos, inicio y detención de los contenedores y también su migración entre servidores
-----

## Microservicios y Monolitos

- Monolito: todo el código acoplado sin comunicación
- Microservicios:es  dividir las tareas en componentes de módulos independientes que conforman un proyecto
  - Esto hace que se pueda desarrollar en diferentes módulos por distintos desarrolladores
  - Son más complejos de desarrollar. Lso microservicios están ligados a Docker
  - La escalabilidad es hacia afuera, donde la demnada adicional se maneja mediante el aprovisionamiento de multiples máquinas en las que se puede distribuir la carga
  - Si hay una demanda creciente de una funcionalidad específica puedo replicar el microservicio en máquinas distintas
  - Solo es posible escalar los recursos necesarios para un recurso concreto centrándose en los cuellos de botella (del sistema)
----

## CI/CD y DevOps

- Continuous integration (CI)   |  Continuos Delivery(CD)   | Continuos Deployment(CD)
- CI: Build | Test | Merge(Git)
- Continuos Delivery: Liberación automática al repositorio
- Continuos Deployment: Despliegue automático hacia producción
- **Docker** facilita este flujo de trabajo
- DevOps es un acrónimo de development y operations. Es una práctica complementaria a la metodología AGIL
- Defiende activamente la automatización y el monitoreo de todos los pasos en el desarrollo de software
- Apunta a ciclos de desarrollo más cortos, mayor implementación, una estrecha alineación con los objetivos comerciales
- Es un conjunto de prácticas de un ciclo continuo dónde cada fase del desarrollo tiene unas operaciones tecnologicas distintas
    - Code: Confluence, JIRA, git
    - Release: jenkins, CodeShip
    - Monitor: Nagios, splunk, Datadog 
    - Operate: CHEF, Ansible, Kubernetes (gestión de los contenedores)
    - Deploy: **Docker**, AWS, DC/OS
    - Test: Se, JUnit
    - Build: Maven, sbt
----

## Ventajas de los contenedores Docker

- Retorno de la inversión y ahorro de costos 
  - reduce recursos de infraestructura y otros
- Standarización y productividad
  - Garantizan la coherencia en multiples ciclos de desarrollo estandarizando el entorno
  - Los desarrolladores trabajan en entornos de paridad y ahorran tiempo de configuración
- Eficiencia de CI
  - Las imagenes permiten separar los pasos de desarrollo no dependientes y ejecutarlos en paralelo
- Compatibilidad y mantenibilidad
- Simplicidad y configuraciones más rápidas
- Despliegue rápido
  - Logra reducir la implementación a segundos
  - Crea un contenedor para cada proceso y no arranca un sistema operativo
  - Los datos pueden crearse y destruirse sin preocuparse del costo
- Despliegue continuo y pruebas
  - Permite construir, probar y lanzar en multiples servidores
- Plataformas multi-nube (AWS)
  - La portabilidad es un gran beneficio de Docker
  - Un contenedor que se ejecuta en una instancia de AWS se puede portar facilmente entre entornos ,por ejemplo a VirtualBox
  - Una vez tengo mis imágenes en local, las puedo enviar a la nube y que funcionen también en AWS, Azure, o dónde sea
- Aislamiento
  - Docker garantiza que sus aplicaciones y recursos estén aislados
  - Cada aplicación se ejecuta en su contenedor, por lo que proporciona la eliminación limpia de aplicaciones
  - Se asegura de que cada aplicación use solo los recursos que se les ha asignado
- Seguridad
  - Docker garantiza que las aplicaciones que se ejcutan en contenedores están segregadas y aisladas entre si
  - Esto otorga un control total del flujo y la administración del tráfico de datos
  - Ningún contenedor puede ver los procesos que se ejcutan en otro contenedor
------   








































