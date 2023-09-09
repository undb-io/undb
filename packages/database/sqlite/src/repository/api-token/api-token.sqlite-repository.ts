import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { ApiToken as ApiTokenDo, ApiTokenSpecification, IApiTokenRepository } from '@undb/openapi'
import { None, Some, type Option } from 'oxide.ts'
import { ApiToken } from '../../entity/api-token.js'
import { User } from '../../entity/user.js'
import { ApiTokenSqliteMapper } from './api-token-sqlite.mapper.js'
import { ApiTokenQueryVisitor } from './api-token.query-visitor.js'

export class ApiTokenSqliteRepository implements IApiTokenRepository {
  constructor(private readonly em: EntityManager) {}

  async find(spec: ApiTokenSpecification): Promise<ApiTokenDo[]> {
    const em = this.em.fork()
    const qb = em.qb(ApiToken)
    const visitor = new ApiTokenQueryVisitor(qb)

    spec.accept(visitor)

    const results = await qb.getResultList()

    return results.map((r) => ApiTokenSqliteMapper.toDomain(r))
  }

  async findOneById(id: string): Promise<Option<ApiTokenDo>> {
    const token = await this.em.findOne(ApiToken, id)
    if (!token) return None
    return Some(ApiTokenSqliteMapper.toDomain(token))
  }

  async findOne(spec: ApiTokenSpecification): Promise<Option<ApiTokenDo>> {
    const em = this.em.fork()
    const qb = em.qb(ApiToken)
    const visitor = new ApiTokenQueryVisitor(qb)

    spec.accept(visitor)

    const result = await qb.getSingleResult()
    if (!result) return None

    return Some(ApiTokenSqliteMapper.toDomain(result))
  }

  async insert(token: ApiTokenDo): Promise<void> {
    const user = this.em.getReference(User, token.userId.value)
    const entity = new ApiToken(token, user)
    await this.em.fork().persistAndFlush(entity)
  }

  async deleteOneById(id: string): Promise<void> {
    await this.em.nativeDelete(ApiToken, { id })
  }
}
