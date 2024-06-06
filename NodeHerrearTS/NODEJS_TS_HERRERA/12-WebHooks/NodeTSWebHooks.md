# NODE TS WebHooks

- Creo un repositorio en Github
- En Settings/WebHooks/Add WebHook
- Tengo Payload URL
- Content-Type trabajaremos con application/json
- Secret es la palabra secreta que nadie debe saber
- Send me everything envia todo lo sucedido (muy ruidoso)
- Let me select individual events puedo seleccionar que github me avise de cualquiera de los sucesos que pasen en este repositorio
- Usaremos un bot de Discord para visualizarlo y no tener que entrar a un servidor, consola, etc. para visualizar la data
----

## Creación de Github Endpoint

- Creo el endpoint localhost:3000/api/github
