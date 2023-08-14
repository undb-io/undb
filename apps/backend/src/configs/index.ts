import { authConfig } from './auth.config.js'
import { BaseConfigService } from './base-config.service.js'
import { cacheStorageConfig } from './cache-storage.config.js'
import { mailConfig } from './mail.config.js'
import { objectStorageConfig } from './object-storage.config.js'
import { outboxConfig } from './outbox.config.js'
import { sqliteConfig } from './sqlite.config.js'
import { webhookConfig } from './webhook.config.js'

export const configurations = [
  sqliteConfig,
  objectStorageConfig,
  authConfig,
  cacheStorageConfig,
  webhookConfig,
  outboxConfig,
  mailConfig,
]

export const configProviders = [BaseConfigService]
