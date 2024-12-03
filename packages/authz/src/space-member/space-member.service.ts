import type { IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { and, None, Option } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectSpaceService, type ISpaceId, type ISpaceService } from "@undb/space"
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
import { WithEmail, WithInvitedAt, WithRole, WithSpaceId, WithStatus } from "./invitation.specification"
import { SpaceMember, type ISpaceMemberRole } from "./space-member"
import type { SpaceMemberComositeSpecification } from "./space-member.composite-specification"
import { injectSpaceMemberRepository, type ISpaceMemberRepository } from "./space-member.repository"
import { WithSpaceMemberEmail, WithSpaceMemberId, WithSpaceMemberSpaceId } from "./specifications"

export interface ISpaceMemberService {
  createMember(userId: string, spaceId: ISpaceId, role: ISpaceMemberRole): Promise<void>
  invite(dto: InviteDTO, username: string): Promise<void>
  acceptinvitation(id: string): Promise<void>
  getSpaceMember(userId: string, spaceId: ISpaceId): Promise<Option<SpaceMember>>
  setSpaceMemberContext(context: IContext, spaceId: ISpaceId, userId: string): Promise<Option<SpaceMember>>
}

export const SPACE_MEMBER_SERVICE = Symbol("ISpaceMemberService")

export const injectSpaceMemberService = () => inject(SPACE_MEMBER_SERVICE)

@singleton()
export class SpaceMemberService implements ISpaceMemberService {
  private logger = createLogger("SpaceMemberService")
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
    const existsSpec = and(
      new WithSpaceMemberEmail(dto.email),
      new WithSpaceMemberSpaceId(dto.spaceId),
    ) as Option<SpaceMemberComositeSpecification>
    const exists = await this.spaceMemberRepository.exists(existsSpec.unwrap())
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

    const spec = new WithEmail(dto.email).and(new WithSpaceId(space.unwrap().id.value))
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

  async setSpaceMemberContext(context: IContext, spaceId: ISpaceId, userId: string): Promise<Option<SpaceMember>> {
    this.logger.debug({ spaceId, userId }, "setSpaceMemberContext")

    if (!spaceId || !userId) {
      return None
    }
    const member = await this.getSpaceMember(userId, spaceId)
    if (member.isNone()) {
      return None
    }

    context.setContextValue("member", {
      role: member.unwrap().props.role,
      spaceId,
    })

    return member
  }
}
