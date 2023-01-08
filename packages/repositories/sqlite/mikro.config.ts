import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core'
import { Table } from './entity'

export const config = defineConfig({
  entities: [Table],
  metadataProvider: ReflectMetadataProvider,
  driver: BetterSqliteDriver,
  dbName: 'ego.db',
})
