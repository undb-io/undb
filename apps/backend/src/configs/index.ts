import { authConfig } from './auth.config.js'
import { BaseConfigService } from './base-config.service.js'
import { cacheStorageConfig } from './cache-storage.config.js'
import { objectStorageConfig } from './object-storage.config.js'
import { sqliteConfig } from './sqlite.config.js'

export const configurations = [sqliteConfig, objectStorageConfig, authConfig, cacheStorageConfig]

export const configProviders = [BaseConfigService]
