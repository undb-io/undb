import { MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { ApiTokenSqliteRepository, EntityManager } from '@undb/sqlite'

export const API_TOKEN_REPOSITORY = Symbol('API_TOKEN_REPOSITORY')

export const InjectApiTokenRepository = () => Inject(API_TOKEN_REPOSITORY)

@Injectable()
export class NestApiTokenSqliteRepository extends ApiTokenSqliteRepository {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }
}
