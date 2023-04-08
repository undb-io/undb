import Joi from 'joi'
import path from 'node:path'

export const configSchema = Joi.object({
  // base
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(4000),
  // databse
  UNDB_DATABASE_SQLITE_DATA: Joi.string().default(path.resolve(process.cwd(), '../../.undb/data')),
  // storage object
  UNDB_OBJECT_STORAGE_PROVIDER: Joi.string().valid('local').default('local'),
  UNDB_OBJECT_STORAGE_LOCAL_PATH: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 'local',
    then: Joi.string().default(path.resolve(process.cwd(), './attachments')),
  }),
  UNDB_JWT_SECRET: Joi.string().default('jwt_secret'),
  UNDB_ADMIN_EMAIL: Joi.string().email().optional(),
  UNDB_ADMIN_PASSWORD: Joi.string().optional(),
})
