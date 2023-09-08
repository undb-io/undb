import type { QueryBuilder } from '@mikro-orm/better-sqlite'
import type { ISpecification, ISpecVisitor } from '@undb/domain'
import type { ApiToken as ApiTokenDo, IApiTokenVisitor, WithApiTokenId, WithApiTokenToken } from '@undb/openapi'
import type { ApiToken } from '../../entity/api-token.js'

export class ApiTokenQueryVisitor implements IApiTokenVisitor {
  constructor(private readonly qb: QueryBuilder<ApiToken>) {
    this.qb = this.qb.andWhere({ deletedAt: null })
  }
  withId(s: WithApiTokenId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withToken(s: WithApiTokenToken): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<ApiTokenDo, ISpecVisitor>, right: ISpecification<ApiTokenDo, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
