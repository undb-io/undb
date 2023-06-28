import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { NestUserSqliteQueryModel } from './sqlite/user-sqlite.query-model.js'
import { NestUserSqliteRepository } from './sqlite/user-sqlite.repository.js'

export const USER_QUERY_MODEL = Symbol('USER_QUERY_MODEL')
export const InjectUserQueryModel = () => Inject(USER_QUERY_MODEL)

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')
export const InjectUserRepository = () => Inject(USER_REPOSITORY)

export const dbAdapters: Provider[] = [
  {
    provide: USER_QUERY_MODEL,
    useClass: NestUserSqliteQueryModel,
  },
  {
    provide: USER_REPOSITORY,
    useClass: NestUserSqliteRepository,
  },
]
