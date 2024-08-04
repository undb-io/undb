import { inject, singleton } from "@undb/di"
import { and, None, Option } from "@undb/domain"
import { injectSpaceService, type ISpaceId, type ISpaceService } from "@undb/space"
import type { SetContextValue } from "../../../context/src/context.type"
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
import { SpaceMember, type ISpaceMemberRole } from "./space-member"
import { injectSpaceMemberRepository, type ISpaceMemberRepository } from "./space-member.repository"
import { WithSpaceMemberId, WithSpaceMemberSpaceId } from "./specifications"

export interface ISpaceMemberService {
  createMember(userId: string, spaceId: ISpaceId, role: ISpaceMemberRole): Promise<void>
  invite(dto: InviteDTO, username: string): Promise<void>
  acceptinvitation(id: string): Promise<void>
  getSpaceMember(userId: string, spaceId: ISpaceId): Promise<Option<SpaceMember>>
  setSpaceMemberContext(setContext: SetContextValue, spaceId: ISpaceId, userId: string): Promise<Option<SpaceMember>>
}

export const SPACE_MEMBER_SERVICE = Symbol("ISpaceMemberService")

export const injectSpaceMemberService = () => inject(SPACE_MEMBER_SERVICE)

@singleton()
export class SpaceMemberService implements ISpaceMemberService {
  constructor(
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectSpaceMemberRepository()
    private readonly spaceMemberRepository: ISpaceMemberRepository,
    @injectInvitationRepository()
    private readonly invitationRepository: IInvitationRepository,
    @injectInvitationQueryRepository()
    private readonly invitationQueryRepository: IInvitationQueryRepository,
    @inject(InvitationMailService)
    private readonly invitationMailService: IInvitationMailService,
  ) {}

  async createMember(userId: string, spaceId: ISpaceId, role: ISpaceMemberRole): Promise<void> {
    const member = new SpaceMember({ id: MemberIdVO.create().value, spaceId, userId, role })

    await this.spaceMemberRepository.insert(member)
  }

  async getSpaceMember(userId: string, spaceId: ISpaceId): Promise<Option<SpaceMember>> {
    const spec = and(new WithSpaceMemberId(userId), new WithSpaceMemberSpaceId(spaceId))
    return this.spaceMemberRepository.findOne(spec.unwrap())
  }

  async invite(dto: InviteDTO, username: string): Promise<void> {
    const exists = await this.spaceMemberRepository.exists(dto.email)
    if (exists) {
      throw new Error("Member already exists")
    }

    const space = await this.spaceService.getSpace({ spaceId: dto.spaceId })
    if (space.isNone()) {
      throw new Error("Space not found")
    }

    if (space.unwrap().isPersonal) {
      throw new Error("Cannot invite to personal space")
    }

    const spec = new WithEmail(dto.email)
    const existInvitation = await this.invitationQueryRepository.findOne(spec)
    if (existInvitation.isSome()) {
      const invitation = existInvitation.unwrap()
      const spec = and(
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

  async setSpaceMemberContext(
    setContext: SetContextValue,
    spaceId: ISpaceId,
    userId: string,
  ): Promise<Option<SpaceMember>> {
    if (!spaceId || !userId) {
      return None
    }
    const member = await this.getSpaceMember(userId, spaceId)
    if (member.isNone()) {
      return None
    }

    setContext("member", {
      role: member.unwrap().props.role,
      spaceId,
    })

    return member
  }
}
