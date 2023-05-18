import { BetterSqliteDriver, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migration20230507094448 } from '../src/migrations/Migration20230507094448.js'
import { Migration20230511142430 } from '../src/migrations/Migration20230511142430.js'
import { Migration20230518040812 } from '../src/migrations/Migration20230518040812.js'

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
