import type { ISpecVisitor } from "@undb/domain"
import type { WithSpaceMemberQ } from "./specifications"
import type { WithSpaceMemberBaseId } from "./specifications/space-member-base-id.specification"
import type { WithSpaceMemberId } from "./specifications/space-member-id.specification"
import type { WithSpaceMemberSpaceId } from "./specifications/space-member-space-id.specification"

export interface ISpaceMemberVisitor extends ISpecVisitor {
  withId(q: WithSpaceMemberId): void
  withQ(q: WithSpaceMemberQ): void
  withSpaceId(s: WithSpaceMemberSpaceId): void
  withBaseId(s: WithSpaceMemberBaseId): void
}
