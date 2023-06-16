import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { SqliteLogger } from './logger.js'
import { Migration20230616011519 } from './migrations/Migration20230616011519.js'

export const createConfig = (data: string, env = 'development') =>
  defineConfig({
    entities,
    entitiesTs: entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: path.join(data, `undb.db`),
    debug: env !== 'production' ? ['query'] : false,
    forceUndefined: true,
    flushMode: FlushMode.ALWAYS,
    loggerFactory: (options) => new SqliteLogger(options),
    migrations: {
      disableForeignKeys: true,
      snapshot: true,
      migrationsList: [
        {
          name: 'initial',
          class: Migration20230616011519,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
