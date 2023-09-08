import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { ApiToken } from './api-token.js'
import type { WithApiTokenId } from './specifications/api-token-id.specification.js'
import type { WithApiTokenToken } from './specifications/api-token-token.specification.js'

export interface IApiTokenVisitor extends ISpecVisitor {
  withId(s: WithApiTokenId): void
  withToken(s: WithApiTokenToken): void
}

export type ApiTokenSpecification = CompositeSpecification<ApiToken, IApiTokenVisitor>
