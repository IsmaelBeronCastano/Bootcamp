# Comunicación RabbitMQ

- Desde routes de api-gateway se expone el endpoint que comunica con el controller
- Desde el controller del api-gateway me comunico con el servicio de api-gateway
- Desde el servicio de api-gateway me comunico con la instancia de axios a la que le paso el endpoint del ms
- El endpoint comunica con el controller del ms
- El controller usa el serviico del ms
- Es en el servicio del ms donde hago uso de RabbitMQ