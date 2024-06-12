import { inject, singleton } from "@undb/di"
import { injectWorkspaceMemberRepository, type IWorkspaceMemberRepository } from "./workspace-member.repository"
import { WorkspaceMember, type IWorkspaceMemberRole } from "./workspace-member"
import { MemberIdVO } from "../member/member-id.vo"

export interface IWorkspaceMemberService {
  createMember(userId: string, role: IWorkspaceMemberRole): Promise<void>
}

export const WORKSPACE_MEMBER_SERVICE = Symbol("IWorkspaceMemberService")

export const injectWorkspaceMemberService = () => inject(WORKSPACE_MEMBER_SERVICE)

@singleton()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @injectWorkspaceMemberRepository()
    private readonly workspaceMemberRepository: IWorkspaceMemberRepository,
  ) {}

  async createMember(userId: string, role: IWorkspaceMemberRole): Promise<void> {
    const member = new WorkspaceMember({ id: MemberIdVO.create().value, userId, role })

    await this.workspaceMemberRepository.insert(member)
  }
}
