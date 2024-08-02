import type { ISpecVisitor } from "@undb/domain"
import type { WithSpaceMemberQ } from "./specifications"
import type { WithSpaceMemberId } from "./specifications/workspace-member-id.specification"

export interface ISpaceMemberVisitor extends ISpecVisitor {
  withId(q: WithSpaceMemberId): void
  withQ(q: WithSpaceMemberQ): void
}
