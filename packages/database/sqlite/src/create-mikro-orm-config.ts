import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { Migration20230528115246 } from './migrations/Migration20230528115246.js'

export const createConfig = (data: string, env = 'development') =>
  defineConfig({
    entities,
    entitiesTs: entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: path.join(data, `undb.db`),
    debug: env !== 'production',
    forceUndefined: true,
    flushMode: FlushMode.ALWAYS,
    migrations: {
      disableForeignKeys: true,
      snapshot: true,
      migrationsList: [
        {
          name: 'initial',
          class: Migration20230528115246,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
