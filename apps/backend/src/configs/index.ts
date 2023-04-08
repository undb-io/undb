import { authConfig } from './auth.config.js'
import { BaseConfigService } from './base-config.service.js'
import { objectStorageConfig } from './object-storage.config.js'
import { sqliteConfig } from './sqlite.config.js'

export const configurations = [sqliteConfig, objectStorageConfig, authConfig]

export const configProviders = [BaseConfigService]
