import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { SqliteLogger } from './logger.js'
import { Migration20230927011121 } from './migrations/Migration20230927011121.js'
import { isMemoryDatabase } from './utils.js'

export const createConfig = (data: string, env = 'development') =>
  defineConfig({
    extensions: [Migrator],
    entities,
    entitiesTs: entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: isMemoryDatabase(data) ? data : path.join(data, `undb.db`),
    debug: env !== 'production' ? ['query'] : false,
    forceUndefined: true,
    flushMode: FlushMode.ALWAYS,
    loggerFactory: env === 'production' ? undefined : (options) => new SqliteLogger(options),
    migrations: {
      disableForeignKeys: true,
      snapshot: true,
      migrationsList: [
        {
          name: 'initial',
          class: Migration20230927011121,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
