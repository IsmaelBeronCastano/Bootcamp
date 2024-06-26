# 04 NEST MICROSERVICIOS AWS

- Nos logueamos en AWS
- En All Services acced EC2
- Aquí es donde crearemos las instancias. Voy a instances running
- Le doy a Launch instances (free only)
- Seleccionamos Ubuntu server LTS en 64 bits
- Next, Next, le coloco un espacio de 20 GB en Add Storage
- Next, Next, En el 6: Configure Security group
  - Le coloco de nombre internet
  - Description: ssh
- Tengo SSH TCP  22 Custom 0.0.0.0/0
- Agrego HTTP TCP 80  Custom 0.0.0.0/0, ::/0
- HTTPS TCP 443 Custom 0.0.0.0/0,. ::/0
- Le damos a Launch
- Uso mi llave privada (si no creo una) (hay que tenerla descargada)
- Launch instances
- En la pantalla de instances, doy click en mi instance ID o selecciono y doly click a conectar
- En EC2 instances doy click a conectar
- Estoy en el ubuntu server
- Hago un apt update && upgrade
-----

## Despliegue de contenedores

- El despliegue no lo haremos desde la consola, lo haremos desde un programa que se llama **MobaXterm**
- En SSH, pego la ip publica de mi instancia en remote host, en specify user name le digo ubuntu
- En use private key copio mi llave privada
- OK
- Para instalar Docker uso sudo apt install docker.io

> cd /opt

- Creo la carpet microservices-superflights

> sudo mkdir microservices-superflights
> cd microservices-superflights
> sudo nano docker-compose.yml

- Copiamos el docker-compose.prod.yml y lo pegamos en el editor de la consola de ubuntu que hemos abierto (nano)
- Guardamos como docker-compose.yml
- Creamos el archivo de variables de entorno con sudo nano .env
- Pegamos las env

~~~
# API
APP_URL=https://superflights.com
PORT=3000

# JWT
JWT_SECRET=JWTCl4v3S3cr3t4@Api
EXPIRES_IN=12h

#Database Connection
URI_MONGODB=mongodb://mongodb:27017/superFlights

#RabbitMQ
AMQP_URL=amqp://rabbitmq:5672
~~~

- Guardo
- Agrego $USER al grupo de docker

> sudo usermod -aG docker $USER

- Reinicio docker service

> sudo service docker restart

- Corro los contenedores

> sudo docker compose up -d


- Copiamos la direccion IP pública de AWS  en la pantalla de instance summary de mi instancia
- La pego en el navegador y agrego /api/docs y tengo la documentación de Swagger