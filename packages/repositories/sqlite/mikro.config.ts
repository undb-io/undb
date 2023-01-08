import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core'
import path from 'path'
import { Table } from './entity'
import { Init } from './migrations/init'

export const config = defineConfig({
  entities: [Table],
  metadataProvider: ReflectMetadataProvider,
  driver: BetterSqliteDriver,
  baseDir: process.cwd(),
  dbName: path.resolve(process.cwd(), '../../.ego/data/ego.sqlite'),
  debug: true,
  migrations: {
    tableName: 'migrations',
    migrationsList: [
      {
        name: 'init',
        class: Init,
      },
    ],
  },
})
