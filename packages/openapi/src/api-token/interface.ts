import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { ApiTokenDo } from "./api-token.do.js"
import type { WithApiTokenId } from "./specifications/api-token-id.specification.js"
import type { WithApiTokenSpaceId } from "./specifications/api-token-space-id.specification.js"
import type { WithApiTokenToken } from "./specifications/api-token-token.specification.js"
import type { WithApiTokenUserId } from "./specifications/api-token-user-id.specification.js"

export interface IApiTokenVisitor extends ISpecVisitor {
  withId(s: WithApiTokenId): void
  withSpaceId(s: WithApiTokenSpaceId): void
  withToken(s: WithApiTokenToken): void
  withUserId(s: WithApiTokenUserId): void
}

export type ApiTokenSpecification = CompositeSpecification<ApiTokenDo, IApiTokenVisitor>
