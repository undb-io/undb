import Joi from 'joi'
import path from 'node:path'

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  EGODB_DATABASE_SQLITE_DATA: Joi.string().default(path.resolve(process.cwd(), '../../.ego/data')),
})
