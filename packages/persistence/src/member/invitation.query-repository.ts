import type { IInvitationQueryRepository, InvitationCompositeSpecification, InvitationDTO } from "@undb/authz"
import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { InvitationFilterVisitor } from "./invitation.filter-visitor"

@singleton()
export class InvitationQueryRepository implements IInvitationQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}
  async findOneById(id: string): Promise<Option<InvitationDTO>> {
    const invitation = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_invitation")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()

    return invitation
      ? Some({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          invitedAt: invitation.invited_at,
          inviterId: invitation.inviter_id,
          status: invitation.status,
          spaceId: invitation.space_id,
        })
      : None
  }

  async findOne(spec: InvitationCompositeSpecification): Promise<Option<InvitationDTO>> {
    const invitation = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_invitation")
      .selectAll()
      .where((eb) => {
        const visitor = new InvitationFilterVisitor(eb, this.context.mustGetCurrentSpaceId())
        spec.accept(visitor)

        return visitor.cond
      })
      .executeTakeFirst()

    return invitation
      ? Some({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          invitedAt: invitation.invited_at,
          inviterId: invitation.inviter_id,
          status: invitation.status,
          spaceId: invitation.space_id,
        })
      : None
  }

  async find(spec: Option<InvitationCompositeSpecification>): Promise<InvitationDTO[]> {
    const invitations = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_invitation")
      .selectAll()
      .where((eb) => {
        const visitor = new InvitationFilterVisitor(eb, this.context.mustGetCurrentSpaceId())
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }

        return visitor.cond
      })
      .execute()

    return invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
      invitedAt: i.invited_at,
      inviterId: i.inviter_id,
      spaceId: i.space_id,
    }))
  }
}
