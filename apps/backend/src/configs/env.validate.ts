import Joi from 'joi'
import path from 'node:path'

export const configSchema = Joi.object({
  // base
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(4000),
  // databse
  EGODB_DATABASE_SQLITE_DATA: Joi.string().default(path.resolve(process.cwd(), '../../.ego/data')),
  // storage object
  EGODB_OBJECT_STORAGE_PROVIDER: Joi.string().valid('local').default('local'),
  EGODB_OBJECT_STORAGE_LOCAL_PATH: Joi.when('EGODB_OBJECT_STORAGE_PROVIDER', {
    is: 'local',
    then: Joi.string().default(path.resolve(process.cwd(), './attachments')),
  }),
})
