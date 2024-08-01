import type { ISpecVisitor } from "@undb/domain"
import type { WithWorkspaceMemberQ } from "./specifications"
import type { WithWorkspaceMemberId } from "./specifications/workspace-member-id.specification"

export interface IWorkspaceMemberVisitor extends ISpecVisitor {
  withId(q: WithWorkspaceMemberId): void
  withQ(q: WithWorkspaceMemberQ): void
}
