import { BetterSqliteDriver, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migration20230528115246 } from '../src/migrations/Migration20230528115246.js'
import { Migration20230612140223 } from '../src/migrations/Migration20230612140223.js'
import { Migration20230614034637 } from '../src/migrations/Migration20230614034637.js'

beforeAll(async () => {
  const { entities } = await import('../src/entity/index.js')
  const orm = await MikroORM.init(
    defineConfig({
      entities,
      metadataProvider: TsMorphMetadataProvider,
      dbName: ':memory:',
      driver: BetterSqliteDriver,
      migrations: {
        migrationsList: [
          {
            name: 'initial',
            class: Migration20230528115246,
          },
          {
            name: 'create outbox',
            class: Migration20230612140223,
          },
          {
            name: 'create webhook',
            class: Migration20230614034637,
          },
        ],
      },
    }),
  )
  const migrator = orm.getMigrator()
  await migrator.up()
  // @ts-expect-error type
  global.orm = orm
  // @ts-expect-error type
  global.em = orm.em
  // @ts-expect-error type
  global.knex = orm.em.getKnex()
})
