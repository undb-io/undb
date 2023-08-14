import Joi from 'joi'
import path from 'node:path'

export const configSchema = Joi.object({
  UNDB_HOST: Joi.string().uri().default('http://localhost:4000'),
  // base
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(4000),
  // databse
  UNDB_DATABASE_SQLITE_DATA: Joi.string().default(path.resolve(process.cwd(), '../../.undb/data')),
  UNDB_SEED: Joi.string().equal('true').optional(),
  // storage object
  UNDB_OBJECT_STORAGE_PROVIDER: Joi.string().valid('local', 's3').default('local'),
  UNDB_OBJECT_STORAGE_LOCAL_PATH: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 'local',
    then: Joi.string().default(path.resolve(process.cwd(), './attachments')),
  }),

  // outbox
  UNDB_OUTBOX_POLLING_INTERVAL_SECONDS: Joi.number().integer().positive().max(30).default(1),
  UNDB_OUTBOX_POLLING_COUNT: Joi.number().integer().positive().max(10_000).default(100),

  // webhook
  UNDB_WEBHOOK_SECRET: Joi.string().optional(),
  UNDB_WEBHOOK_PUBLISH_PROVIDER: Joi.valid('memory', 'temporal').default('memory'),
  UNDB_WEBHOOK_TEMPORAL_ADDR: Joi.when('UNDB_WEBHOOK_PUBLISH_PROVIDER', {
    is: 'temporal',
    then: Joi.string(),
  }),
  UNDB_WEBHOOK_TEMPORAL_NAMESPACE: Joi.when('UNDB_WEBHOOK_PUBLISH_PROVIDER', {
    is: 'temporal',
    then: Joi.string().optional(),
  }),

  // s3
  UNDB_S3_ENDPOINT: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),
  UNDB_S3_BUCKET: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string().default('undb'),
  }),
  UNDB_S3_ACCESS_KEY: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),
  UNDB_S3_SECRET_KEY: Joi.when('UNDB_OBJECT_STORAGE_PROVIDER', {
    is: 's3',
    then: Joi.string(),
  }),

  // auth
  UNDB_JWT_SECRET: Joi.string().default('jwt_secret'),
  UNDB_ADMIN_EMAIL: Joi.string().email().optional(),
  UNDB_ADMIN_PASSWORD: Joi.string().optional(),

  // cache
  UNDB_CACHE_STORAGE_PROVIDER: Joi.string().valid('memory', 'fs', 'redis', 'mongo').default('memory'),
  UNDB_CACHE_STORAGE_REDIS_HOST: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'redis',
    then: Joi.string(),
  }),
  UNDB_CACHE_STORAGE_REDIS_PORT: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'redis',
    then: Joi.string(),
  }),
  UNDB_CACHE_STORAGE_REDIS_PASSWORD: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'redis',
    then: Joi.string().optional().allow(''),
  }),
  UNDB_CACHE_STORAGE_REDIS_BASE: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'redis',
    then: Joi.string().optional().allow('').default('undb_cache'),
  }),
  UNDB_CACHE_STORAGE_REDIS_TTL: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'redis',
    then: Joi.number().positive().optional(),
  }),

  UNDB_CACHE_STORAGE_MONGO_CONNECTION_STRING: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'mongo',
    then: Joi.string(),
  }),
  UNDB_CACHE_STORAGE_MONGO_DATABASE_NAME: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'mongo',
    then: Joi.string().optional().default('undb_cache'),
  }),
  UNDB_CACHE_STORAGE_MONGO_COLLECTION_NAME: Joi.when('UNDB_CACHE_STORAGE_PROVIDER', {
    is: 'mongo',
    then: Joi.string().optional().default('undb_cache'),
  }),

  // mail
  UNDB_MAIL_PROVIDER: Joi.string().valid('basic').optional(),
  UNDB_MAIL_HEALTH: Joi.when('UNDB_MAIL_PROVIDER', {
    is: 'basic',
    then: Joi.string().uri(),
  }),
  UNDB_MAIL_HOST: Joi.string().optional(),
  UNDB_MAIL_PORT: Joi.number().port().optional(),
  UNDB_MAIL_DEFAULT_FROM: Joi.string().optional(),
})
