import type { ISpecVisitor } from "@undb/domain"
import type { WithSpaceMemberQ } from "./specifications"
import type { WithSpaceMemberBaseId } from "./specifications/space-member-base-id.specification"
import type { WithSpaceMemberEmail } from "./specifications/space-member-email.specification"
import type { WithSpaceMemberId } from "./specifications/space-member-id.specification"
import type { WithSpaceMemberSpaceId } from "./specifications/space-member-space-id.specification"
import type { WithSpaceMemberUserId } from "./specifications/space-member-user-id.specification"

export interface ISpaceMemberVisitor extends ISpecVisitor {
  withId(q: WithSpaceMemberId): void
  withQ(q: WithSpaceMemberQ): void
  withEmail(q: WithSpaceMemberEmail): void
  withSpaceId(s: WithSpaceMemberSpaceId): void
  withUserId(s: WithSpaceMemberUserId): void
  withBaseId(s: WithSpaceMemberBaseId): void
}
