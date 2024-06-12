import { inject } from "@undb/di"
import { WorkspaceMember } from "./workspace-member"

export interface IWorkspaceMemberRepository {
  findOneById(id: string): Promise<WorkspaceMember>
  findOneByUserId(userId: string): Promise<WorkspaceMember>

  insert(member: WorkspaceMember): Promise<void>
}

export const WORKSPACE_MEMBER_REPOSITORY = Symbol("IWorkspaceMemberRepository")
export const injectWorkspaceMemberRepository = () => inject(WORKSPACE_MEMBER_REPOSITORY)
