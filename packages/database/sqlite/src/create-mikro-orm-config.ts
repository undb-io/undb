import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { Migration20230311120218 } from './migrations/Migration20230311120218.js'

export const createConfig = (data: string, env = 'development') =>
  defineConfig({
    entities,
    entitiesTs: entities,
    highlighter: new SqlHighlighter(),
    metadataProvider: ReflectMetadataProvider,
    driver: BetterSqliteDriver,
    dbName: path.join(data, `ego.${env}.sqlite`),
    debug: env !== 'production',
    forceUndefined: true,
    flushMode: FlushMode.COMMIT,
    migrations: {
      disableForeignKeys: true,
      snapshot: true,
      migrationsList: [
        {
          name: 'Migration20230311120218',
          class: Migration20230311120218,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
