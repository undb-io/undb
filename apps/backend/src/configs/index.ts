import { BaseConfigService } from './base-config.service.js'
import { objectStorageConfig } from './object-storage.js'
import { sqliteConfig } from './sqlite.js'

export const configurations = [sqliteConfig, objectStorageConfig]

export const configProviders = [BaseConfigService]
