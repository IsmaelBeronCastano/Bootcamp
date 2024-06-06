# NEST MICROSERVICIOS - INTEGRAR ORDERS Y PAYMENTS


- Hasta ahora hemos visto el MessagePattern
  - Emito una solicitud (necesito escuchar una respuesta)
- Ahora vamos a usar Event Pattern
  - Te envío un "hola, como estás?" y sigo con mi vida
- Esto es util, porque vamos a tener el webhook, la respuesta rápida que está esperando Stripe (un 200 o 400)
- Y en nuestro lado si vamos a recibir ese evento y procesamos toda la info
- Suena complicado pero son simplemente muchos pasos lógicos
- EL que yo tenga varios NULL en la DB en la fecha cuando se pagó se puede ver como una mala práctica
