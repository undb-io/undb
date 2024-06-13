import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import { WorkspaceMember } from "./workspace-member"

export interface IWorkspaceMemberRepository {
  findOneById(id: string): Promise<WorkspaceMember>
  findOneByUserIdAndWorkspaceId(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>>

  insert(member: WorkspaceMember): Promise<void>
}

export const WORKSPACE_MEMBER_REPOSITORY = Symbol("IWorkspaceMemberRepository")
export const injectWorkspaceMemberRepository = () => inject(WORKSPACE_MEMBER_REPOSITORY)
