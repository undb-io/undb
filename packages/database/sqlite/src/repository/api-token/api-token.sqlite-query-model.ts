import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { ApiTokenSpecification, IApiTokenQueryModel, IQueryApiToken } from '@undb/openapi'
import { None, Some, type Option } from 'oxide.ts'
import { ApiToken } from '../../entity/api-token.js'
import { ApiTokenSqliteMapper } from './api-token-sqlite.mapper.js'
import { ApiTokenQueryVisitor } from './api-token.query-visitor.js'

export class ApiTokenSqliteQueryModel implements IApiTokenQueryModel {
  constructor(private readonly em: EntityManager) {}

  async find(spec: ApiTokenSpecification): Promise<IQueryApiToken[]> {
    const em = this.em.fork()
    const qb = em.qb(ApiToken)
    const visitor = new ApiTokenQueryVisitor(qb)

    spec.accept(visitor)

    const results = await qb.getResultList()

    return results.map((r) => ApiTokenSqliteMapper.toQuery(r))
  }

  async findOneById(id: string): Promise<Option<IQueryApiToken>> {
    const token = await this.em.findOne(ApiToken, id)
    if (!token) return None
    return Some(ApiTokenSqliteMapper.toQuery(token))
  }
}
