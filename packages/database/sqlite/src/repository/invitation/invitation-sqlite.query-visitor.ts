import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type {
  IInvitationVisitor,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import type { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteQueryVisitor implements IInvitationVisitor {
  constructor(
    public readonly em: EntityManager,
    public readonly qb: QueryBuilder<Invitation>,
  ) {}
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
