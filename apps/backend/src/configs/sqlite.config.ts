import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectSqliteConfig = () => Inject(sqliteConfig.KEY)

export const sqliteConfig = registerAs('sqlite', () => ({
  data: process.env.UNDB_DATABASE_SQLITE_DATA,
  seed: process.env.UNDB_SEED === 'true',
}))
