import { Inject, Provider } from '@nestjs/common'
import { NestUserSqliteQueryModel } from './sqlite/user-sqlite.query-model.js'

export const USER_QUERY_MODEL = Symbol('USER_QUERY_MODEL')

export const InjectUserQueryModel = () => Inject(USER_QUERY_MODEL)

export const dbAdapters: Provider[] = [
  {
    provide: USER_QUERY_MODEL,
    useClass: NestUserSqliteQueryModel,
  },
]
