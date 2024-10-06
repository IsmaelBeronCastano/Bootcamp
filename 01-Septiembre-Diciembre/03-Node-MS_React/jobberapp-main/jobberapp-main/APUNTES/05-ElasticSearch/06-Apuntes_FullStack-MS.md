# 06 NODE REACT MICROSERVICIOS - ELASTIC SEARCH

- **Docu**
- Para la instalación

> npm install @elastic/elasticsearch

- Para la conexión

~~~js
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'https://...', // Elasticsearch endpoint
  auth: {
    apiKey: { // API key ID and secret
      id: 'foo',
      api_key: 'bar',
    }
  }
})
~~~

- Para crear un index 

~~~js
await client.indices.create({ index: 'my_index' })
~~~

- Para obtener un documento

~~~js
await client.get({
  index: 'my_index',
  id: 'my_document_id',
})
~~~

- Para buscar 

~~~js
await client.search({
  query: {
    match: {
      foo: 'foo'
    }
  }
})
~~~

- Update

~~~js
await client.update({
  index: 'my_index',
  id: 'my_document_id',
  doc: {
    foo: 'bar',
    new_field: 'new value'
  }
})
~~~

- Delete

~~~js
await client.delete({
  index: 'my_index',
  id: 'my_document_id',
})
~~~

- Incorporando elasticSearch al logger

~~~js
import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
~~~

- Debemos chequear si el index existe antes de crearlo
- La interfaz UI de Kibana está en localhost:5601
- Ahí entro a la consola donde escribir **los comandos** en DevTools, en el menu desplegable de la izquierda
- En StackManagement/index Management vemos los logs de lo creado con elasticSearch con los loggers

~~~js
 const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');
~~~

- En auth-ms/src/elasticsearch.ts tenemos la conexión creada con Client y la función de conexión
- Esta checkConnection se dispara desde el auth-ms/src/server

~~~js
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@auth/config';
import { ISellerGig, winstonLogger } from '@uzochukwueddie/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'AuthService createIndex() method error:', error);
  }
}

async function getDocumentById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId
    });
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'AuthService elastcisearch getDocumentById() method error:', error);
    return {} as ISellerGig;
  }
}

export { elasticSearchClient, checkConnection, createIndex, getDocumentById };
~~~

- Llamo a checkConnection desde el server

~~~js
// start(app:Application){
//     startElasticSearch()
          //  (...)
// }
function startElasticSearch(): void {
  checkConnection();
  createIndex('gigs');
}
~~~