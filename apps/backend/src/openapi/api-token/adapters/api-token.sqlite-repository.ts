import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { ApiToken, type ApiTokenSpecification } from '@undb/openapi'
import { ApiTokenSqliteRepository, EntityManager } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

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

  @CreateRequestContext()
  find(spec: ApiTokenSpecification): Promise<ApiToken[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<ApiToken>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  findOne(spec: ApiTokenSpecification): Promise<Option<ApiToken>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  insert(token: ApiToken): Promise<void> {
    return super.insert(token)
  }
}
