import "dotenv/config";

import * as joi from "joi";

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    RMQ_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Env {
  PORT: number;
  RMQ_URL: string;
}

const envVars: Env = value;

export const envs = {
  port: envVars.PORT as number,
  rmqUrl: envVars.RMQ_URL as string,
};
