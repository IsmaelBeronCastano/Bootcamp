import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_STRING: get('MONGO_STRING').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

}



