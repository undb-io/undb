import { inject, singleton } from "@undb/di"
import { Option } from "@undb/domain"
import { MemberIdVO } from "../member/member-id.vo"
import type { InviteDTO } from "./dto"
import { InvitationDo } from "./invitation.do"
import { injectInvitationRepository, type IInvitationRepository } from "./invitation.repository"
import { InvitationMailService, type IInvitationMailService } from "./invitation.service"
import { WorkspaceMember, type IWorkspaceMemberRole } from "./workspace-member"
import { injectWorkspaceMemberRepository, type IWorkspaceMemberRepository } from "./workspace-member.repository"

export interface IWorkspaceMemberService {
  createMember(userId: string, workspaceId: string, role: IWorkspaceMemberRole): Promise<void>
  invite(dto: InviteDTO): Promise<void>
  getWorkspaceMember(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>>
}

export const WORKSPACE_MEMBER_SERVICE = Symbol("IWorkspaceMemberService")

export const injectWorkspaceMemberService = () => inject(WORKSPACE_MEMBER_SERVICE)

@singleton()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @injectWorkspaceMemberRepository()
    private readonly workspaceMemberRepository: IWorkspaceMemberRepository,
    @injectInvitationRepository()
    private readonly invitationRepository: IInvitationRepository,
    @inject(InvitationMailService)
    private readonly invitationMailService: IInvitationMailService,
  ) {}

  async createMember(userId: string, workspaceId: string, role: IWorkspaceMemberRole): Promise<void> {
    const member = new WorkspaceMember({ id: MemberIdVO.create().value, workspaceId, userId, role })

    await this.workspaceMemberRepository.insert(member)
  }

  async getWorkspaceMember(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>> {
    return this.workspaceMemberRepository.findOneByUserIdAndWorkspaceId(userId, workspaceId)
  }

  async invite(dto: InviteDTO): Promise<void> {
    const exists = await this.workspaceMemberRepository.exists(dto.email)
    if (exists) {
      throw new Error("Member already exists")
    }

    const invitation = new InvitationDo(dto)
    await this.invitationRepository.insert(invitation)
    await this.invitationMailService.send(invitation)
  }
}
