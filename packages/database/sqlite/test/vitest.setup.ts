import { BetterSqliteDriver, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migration20230927011121 } from '../src/migrations/Migration20230927011121.js'

beforeAll(async () => {
  const { entities } = await import('../src/entity/index.js')
  const orm = await MikroORM.init(
    defineConfig({
      extensions: [Migrator],
      entities,
      metadataProvider: TsMorphMetadataProvider,
      dbName: ':memory:',
      driver: BetterSqliteDriver,
      migrations: {
        migrationsList: [
          {
            name: 'initial',
            class: Migration20230927011121,
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
