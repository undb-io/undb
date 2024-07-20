import { inject, singleton } from "@undb/di"
import { and, Option } from "@undb/domain"
import { MemberIdVO } from "../member/member-id.vo"
import type { InviteDTO } from "./dto"
import { InvitationDo } from "./invitation.do"
import {
  injectInvitationQueryRepository,
  injectInvitationRepository,
  type IInvitationQueryRepository,
  type IInvitationRepository,
} from "./invitation.repository"
import { InvitationMailService, type IInvitationMailService } from "./invitation.service"
import { WithEmail, WithInvitedAt, WithRole, WithStatus } from "./invitation.specification"
import { WorkspaceMember, type IWorkspaceMemberRole } from "./workspace-member"
import { injectWorkspaceMemberRepository, type IWorkspaceMemberRepository } from "./workspace-member.repository"

export interface IWorkspaceMemberService {
  createMember(userId: string, workspaceId: string, role: IWorkspaceMemberRole): Promise<void>
  invite(dto: InviteDTO, username: string): Promise<void>
  acceptinvitation(id: string): Promise<void>
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
    @injectInvitationQueryRepository()
    private readonly invitationQueryRepository: IInvitationQueryRepository,
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

  async invite(dto: InviteDTO, username: string): Promise<void> {
    const exists = await this.workspaceMemberRepository.exists(dto.email)
    if (exists) {
      throw new Error("Member already exists")
    }

    const spec = new WithEmail(dto.email)
    const existInvitation = await this.invitationQueryRepository.findOne(spec)
    if (existInvitation.isSome()) {
      const invitation = existInvitation.unwrap()
      const spec = and(
        //
        new WithStatus("pending"),
        new WithInvitedAt(new Date()),
        new WithRole(dto.role ?? invitation.role),
        new WithEmail(dto.email),
      )

      await this.invitationRepository.updateOneById(invitation.id, spec.unwrap())
      await this.invitationMailService.invite(invitation, username)
    } else {
      const invitation = new InvitationDo(dto)
      await this.invitationRepository.insert(invitation)
      await this.invitationMailService.invite(invitation.toJSON(), username)
    }
  }

  async acceptinvitation(id: string): Promise<void> {
    const invitation = await this.invitationQueryRepository.findOneById(id)
    if (invitation.isNone()) {
      throw new Error("Invitation not found")
    }

    const spec = new WithStatus("accepted")
    await this.invitationRepository.updateOneById(id, spec)
  }
}
