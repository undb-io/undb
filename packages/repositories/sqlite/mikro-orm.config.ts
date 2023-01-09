import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity'

export const createConfig = (relativaPath: string) =>
  defineConfig({
    entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: path.resolve(process.cwd(), relativaPath, 'ego.sqlite'),
    debug: true,
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })

export default createConfig('../../../.ego/data')
