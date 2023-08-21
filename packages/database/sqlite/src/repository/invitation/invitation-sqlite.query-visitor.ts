import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type {
  IInvitationVisitor,
  WithInvitationAcceptedAt,
  WithInvitationCancelledAt,
  WithInvitationCancelledBy,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationInvitedAt,
  WithInvitationInvitedBy,
  WithInvitationQ,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import type { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteQueryVisitor implements IInvitationVisitor {
  constructor(
    public readonly em: EntityManager,
    public readonly qb: QueryBuilder<Invitation>,
  ) {}
  like(s: WithInvitationQ): void {
    this.qb.andWhere({ email: { $like: `%${s.q}%` } })
  }
  invitedAt(s: WithInvitationInvitedAt): void {
    throw new Error('Method not implemented.')
  }
  cancelledAt(s: WithInvitationCancelledAt): void {
    throw new Error('Method not implemented.')
  }
  acceptedAt(s: WithInvitationAcceptedAt): void {
    throw new Error('Method not implemented.')
  }
  invitedBy(s: WithInvitationInvitedBy): void {
    this.qb.andWhere({ invitedBy: s.invitedBy.value })
  }
  cancelledBy(s: WithInvitationCancelledBy): void {
    this.qb.andWhere({ cancelledBy: s.cancelledBy.into(null)?.value })
  }
  withStatus(s: WithInvitationStatus): void {
    this.qb.andWhere({ status: s.status.unpack() })
  }
  withInvitationId(s: WithInvitationId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withEmail(s: WithInvitationEmail): void {
    this.qb.andWhere({ email: s.email.unpack() })
  }
  withRole(s: WithInvitationRole): void {
    this.qb.andWhere({ email: s.role.unpack() })
  }
  expiredAt(s: WithInvitationExpiredAt): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
