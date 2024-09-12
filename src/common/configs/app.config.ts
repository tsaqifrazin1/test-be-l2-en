import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JoiUtil, JoiConfig } from 'src/utils';

interface IAppConfig {
  nodeEnv: string;
  port: number;
  secretKey: string;
  postgresHost: string;
  postgresPort: number;
  postgresUsername: string;
  postgresPassword: string;
  postgresDb: string;
  postgresLogging: boolean;
}

export default registerAs('my-app-config-namespace', (): IAppConfig => {
  const configs: JoiConfig<IAppConfig> = {
    nodeEnv: {
      value: process.env.NODE_ENV,
      joi: Joi.string()
        .valid('development', 'production', 'test', 'local')
        .required()
        .messages({
          'string.base': 'NODE_ENV must be a string',
          'string.empty': 'NODE_ENV is required',
          'any.required': 'NODE_ENV is required',
          'any.only': 'NODE_ENV must be one of [development, production, test]',
        }),
    },
    port: {
      value: parseInt(process.env.PORT, 10),
      joi: Joi.number().required().messages({
        'number.base': 'PORT must be a number',
        'number.empty': 'PORT is required',
        'any.required': 'PORT is required',
      }),
    },
    secretKey: {
      value: process.env.SECRET_KEY,
      joi: Joi.string().required().messages({
        'string.base': 'SECRET_KEY must be a string',
        'string.empty': 'SECRET_KEY is required',
        'any.required': 'SECRET_KEY is required',
      }),
    },
    postgresHost: {
      value: process.env.POSTGRES_HOST,
      joi: Joi.string().required().messages({
        'string.base': 'POSTGRES_HOST must be a string',
        'string.empty': 'POSTGRES_HOST is required',
        'any.required': 'POSTGRES_HOST is required',
      }),
    },
    postgresPort: {
      value: parseInt(process.env.POSTGRES_PORT, 10),
      joi: Joi.number().required().messages({
        'number.base': 'POSTGRES_PORT must be a number',
        'number.empty': 'POSTGRES_PORT is required',
        'any.required': 'POSTGRES_PORT is required',
      }),
    },
    postgresUsername: {
      value: process.env.POSTGRES_USERNAME,
      joi: Joi.string().required().messages({
        'string.base': 'POSTGRES_USERNAME must be a string',
        'string.empty': 'POSTGRES_USERNAME is required',
        'any.required': 'POSTGRES_USERNAME is required',
      }),
    },
    postgresPassword: {
      value: process.env.POSTGRES_PASSWORD,
      joi: Joi.string().required().messages({
        'string.base': 'POSTGRES_PASSWORD must be a string',
        'string.empty': 'POSTGRES_PASSWORD is required',
        'any.required': 'POSTGRES_PASSWORD is required',
      }),
    },
    postgresDb: {
      value: process.env.POSTGRES_DB,
      joi: Joi.string().required().messages({
        'string.base': 'POSTGRES_DB must be a string',
        'string.empty': 'POSTGRES_DB is required',
        'any.required': 'POSTGRES_DB is required',
      }),
    },
    postgresLogging: {
      value: process.env.POSTGRES_LOGGING === 'true',
      joi: Joi.boolean().required().messages({
        'boolean.base': 'POSTGRES_LOGGING must be a boolean',
        'boolean.empty': 'POSTGRES_LOGGING is required',
        'any.required': 'POSTGRES_LOGGING is required',
      }),
    },
  };

  return JoiUtil.validate(configs);
});
