import { BetterSqliteDriver, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig, Entity, PrimaryKey } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

@Entity()
class MockEntity {
  @PrimaryKey()
  id!: string
}

beforeAll(async () => {
  const orm = await MikroORM.init(
    defineConfig({
      entities: [MockEntity],
      metadataProvider: TsMorphMetadataProvider,
      dbName: ':memory:',
      driver: BetterSqliteDriver,
    }),
  )

  const knex = orm.em.getKnex()

  // @ts-expect-error type
  global.knex = knex
  // @ts-expect-error type
  global.orm = orm
  // @ts-expect-error type
  global.em = orm.em
})
