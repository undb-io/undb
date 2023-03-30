import { registerAs } from '@nestjs/config'

export const sqliteConfig = registerAs('sqlite', () => ({
  data: process.env.EGODB_DATABASE_SQLITE_DATA,
}))
