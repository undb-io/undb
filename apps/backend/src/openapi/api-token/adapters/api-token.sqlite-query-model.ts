import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryApiToken } from '@undb/openapi'
import { type ApiTokenSpecification } from '@undb/openapi'
import { ApiTokenSqliteQueryModel, EntityManager } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const API_TOKEN_QUERY_MODEL = Symbol('API_TOKEN_QUERY_MODEL')

export const InjectApiTokenQueryModel = () => Inject(API_TOKEN_QUERY_MODEL)

@Injectable()
export class NestApiTokenSqliteQueryModel extends ApiTokenSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: ApiTokenSpecification): Promise<IQueryApiToken[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<IQueryApiToken>> {
    return super.findOneById(id)
  }
}
