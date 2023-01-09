import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core'
import path from 'path'
import { Field, Option, Table } from './entity'

export const config = defineConfig({
  entities: [Table, Field, Option],
  metadataProvider: ReflectMetadataProvider,
  driver: BetterSqliteDriver,
  baseDir: process.cwd(),
  dbName: path.resolve(process.cwd(), '../../.ego/data/ego.sqlite'),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
  },
})
