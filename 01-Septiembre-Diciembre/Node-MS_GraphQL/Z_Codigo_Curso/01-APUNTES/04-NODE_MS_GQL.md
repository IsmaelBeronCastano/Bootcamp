# NODE MICROSERVICIOS GQL - 04 RabbitMQ

- Para usar RabbitMQ haré uso de Docker
- RabbitMQ no es la única opción, podriamos usar NATS entre otros
- RabbitMQ es un servidor de mensajería asíncrona que puede trabajar como un balanceador de carga
- Se usa para tener una comunicación fácil entre microservicios 
- Tiene muchas herramientas y plugins para extender su funcionalidad, para monitorear

~~~yml
version: '3.9'
services:
  rabbitmq:
    container_name: rabbitmq
    image: rabbitmq:3.12.4-management-alpine
    ports:
      - 5672:5672
      - 15672:15672 # para el management desde el navegador
    environment:
      - RABBITMQ_DEFAULT_PASS=admin
      - RABBITMQ_DEFAULT_USER=admin
~~~

- Corriendo la imagen de Docker, coloco en el navegador htt://localhost:15672
- Pongo user admin, password: admin
- Puedo ver que Prometheus está en 15692, lo veremos más adelante (no expongo el cuerpo en el archivo .yml)
- Los exchanges son los diferentes puentes por los que podemos pasar
- Usaremos **AMQP** que srive por defecto
- Puedo crear mi propio exchange
- Desde el management puedo crear usuarios, configuraciones varias, etc
- RabbitMQ Permite desacoplamiento entre microservicios y una alta escabilidad
- Si tengo una data JSON, esta va a venir en formato Buffer
  - Esto quiere decir que para mandar data voy a tener que serializar la data a string y luego convertirla a Buffer
- Permite un enrutamiento flexible
------

## Comenzando el proyecto

- Normalmente se usa una infraestructura ya creada
- Vamos a configurarlo de manera manual, da mucho control pero se complica a medida que se avanza
- La forma recomendable para hacer esto es con **Nest**
- **AMQP** es la librería que usaremos para usar RabbitMQ

> npm i amqplib

- La versión 1.0 no tiene nada que ver con la 0.9.1 que es la que usaremos (la recomendable)
- En la documentación veremos que hay una API que funciona con promesas (callbacks) y otra API que lo hace con async await
- En el index del eventbroker tengo expuesto el endpoint post "/events" con el controlador
- En el controlador están los enums y los llamados a los microservicios
- Puedo trabajar de otra manera con amqp
- En lugar de tener el código acoplado a endpoints (que pueden cambiar) me comunico directamente con los eventos usando RabbitMQ
----

## Capturando el evento

- Hago una copia del proyecto de Node para poder modificarlo para usar RabbitMQ