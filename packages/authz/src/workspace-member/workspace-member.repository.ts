import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import type { IUser } from "@undb/user"
import type { IWorkspaceMemberDTO } from "./dto"
import { WorkspaceMember } from "./workspace-member"

export interface IWorkspaceMemberRepository {
  findOneById(id: string): Promise<WorkspaceMember>
  findOneByUserIdAndWorkspaceId(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>>

  insert(member: WorkspaceMember): Promise<void>
}

export const WORKSPACE_MEMBER_REPOSITORY = Symbol("IWorkspaceMemberRepository")
export const injectWorkspaceMemberRepository = () => inject(WORKSPACE_MEMBER_REPOSITORY)

export interface IWorkspaceMemberQueryRepository {
  find(): Promise<IWorkspaceMemberDTO[]>
  findUserByMemberId(memberId: string): Promise<Option<IUser>>
}

export const WORKSPQACE_MEMBER_QUERY_REPOSITORY = Symbol("IWorkspaceMemberQueryRepository")

export const injectWorkspaceMemberQueryRepository = () => inject(WORKSPQACE_MEMBER_QUERY_REPOSITORY)
