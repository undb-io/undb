import { BetterSqliteDriver, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migration20230131121059 } from '../migrations/Migration20230131121059'

beforeAll(async () => {
  const { entities } = await import('../entity')
  const orm = await MikroORM.init(
    defineConfig({
      entities,
      metadataProvider: TsMorphMetadataProvider,
      dbName: ':memory:',
      driver: BetterSqliteDriver,
      migrations: {
        migrationsList: [
          {
            name: 'Migration20230131121059',
            class: Migration20230131121059,
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
