import { inject, singleton } from "@undb/di"
import { Option } from "@undb/domain"
import type { IUser } from "@undb/user"
import { MemberIdVO } from "../member/member-id.vo"
import { WorkspaceMember, type IWorkspaceMemberRole } from "./workspace-member"
import {
  injectWorkspaceMemberQueryRepository,
  injectWorkspaceMemberRepository,
  type IWorkspaceMemberQueryRepository,
  type IWorkspaceMemberRepository,
} from "./workspace-member.repository"

export interface IWorkspaceMemberService {
  createMember(userId: string, workspaceId: string, role: IWorkspaceMemberRole): Promise<void>
  getWorkspaceMember(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>>
  getUserByMemberId(memberId: string): Promise<Option<IUser>>
}

export const WORKSPACE_MEMBER_SERVICE = Symbol("IWorkspaceMemberService")

export const injectWorkspaceMemberService = () => inject(WORKSPACE_MEMBER_SERVICE)

@singleton()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @injectWorkspaceMemberRepository()
    private readonly workspaceMemberRepository: IWorkspaceMemberRepository,
    @injectWorkspaceMemberQueryRepository()
    private readonly workspaceMemberQueryRepository: IWorkspaceMemberQueryRepository,
  ) {}

  async createMember(userId: string, workspaceId: string, role: IWorkspaceMemberRole): Promise<void> {
    const member = new WorkspaceMember({ id: MemberIdVO.create().value, workspaceId, userId, role })

    await this.workspaceMemberRepository.insert(member)
  }

  async getWorkspaceMember(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>> {
    return this.workspaceMemberRepository.findOneByUserIdAndWorkspaceId(userId, workspaceId)
  }

  async getUserByMemberId(memberId: string): Promise<Option<IUser>> {
    return this.workspaceMemberQueryRepository.findUserByMemberId(memberId)
  }
}
