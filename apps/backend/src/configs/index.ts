import { BaseConfigService } from './base-config.service.js'
import { sqliteConfig } from './sqlite.js'

export const configurations = [sqliteConfig]

export const configProviders = [BaseConfigService]
