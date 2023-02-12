import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'

export const createConfig = (relativaPath: string) =>
  defineConfig({
    entities,
    entitiesTs: entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: path.resolve(process.cwd(), relativaPath, 'ego.sqlite'),
    debug: true,
    forceUndefined: true,
    flushMode: FlushMode.COMMIT,
    migrations: {
      disableForeignKeys: true,
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })

export default createConfig('../../../.ego/data')
