import { CompositeSpecification } from "@undb/domain"
import type { WorkspaceMember } from "./workspace-member"
import type { IWorkspaceMemberVisitor } from "./workspace-member.visitor"

export abstract class WorkspaceMemberComositeSpecification extends CompositeSpecification<
  WorkspaceMember,
  IWorkspaceMemberVisitor
> {}
