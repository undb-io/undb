import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type {
  ApiToken as ApiTokenDo,
  IApiTokenVisitor,
  WithApiTokenId,
  WithApiTokenToken,
  WithApiTokenUserId,
} from '@undb/openapi'

export class ApiTokenMutationVisitor implements IApiTokenVisitor {
  constructor(private readonly em: EntityManager) {}
  withId(s: WithApiTokenId): void {
    throw new Error('Method not implemented.')
  }
  withToken(s: WithApiTokenToken): void {
    throw new Error('Method not implemented.')
  }
  withUserId(s: WithApiTokenUserId): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<ApiTokenDo, ISpecVisitor>, right: ISpecification<ApiTokenDo, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
