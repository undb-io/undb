import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { Migration20230507094448 } from './migrations/Migration20230507094448.js'
import { Migration20230511142430 } from './migrations/Migration20230511142430.js'
import { Migration20230518040812 } from './migrations/Migration20230518040812.js'

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
          name: 'Migration20230507094448',
          class: Migration20230507094448,
        },
        {
          name: 'Migration20230511142430',
          class: Migration20230511142430,
        },
        {
          name: 'Migration20230518040812',
          class: Migration20230518040812,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
