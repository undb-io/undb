import type { ISpecVisitor } from "@undb/domain"
import type { WithWorkspaceMemberQ } from "./specifications"

export interface IWorkspaceMemberVisitor extends ISpecVisitor {
  withQ(q: WithWorkspaceMemberQ): void
}
