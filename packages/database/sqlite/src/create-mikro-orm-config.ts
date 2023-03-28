import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, FlushMode, ReflectMetadataProvider } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'
import { entities } from './entity/index.js'
import { Migration20230326065027 } from './migrations/Migration20230326065027.js'
import { Migration20230328011651 } from './migrations/Migration20230328011651.js'

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
          name: 'Migration20230326065027',
          class: Migration20230326065027,
        },
        {
          name: 'Migration20230328011651',
          class: Migration20230328011651,
        },
      ],
    },
    schemaGenerator: {
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
    },
  })
