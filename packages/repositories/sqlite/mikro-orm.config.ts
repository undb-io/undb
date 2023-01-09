import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity'

export const config = defineConfig({
  entities,
  highlighter: new SqlHighlighter(),
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

export default config
