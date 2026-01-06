import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: 'https://my-elasticsearch-project-aafe3e.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
});
