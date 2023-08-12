import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type {
  IInvitationVisitor,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteMutationVisitor implements IInvitationVisitor {
  constructor(
    public readonly id: string,
    public readonly em: EntityManager,
  ) {}
  withStatus(s: WithInvitationStatus): void {
    const invitation = this.em.getReference(Invitation, this.id)
    wrap(invitation).assign({ status: s.status.unpack() })
    this.em.persist(invitation)
  }
  withInvitationId(s: WithInvitationId): void {
    throw new Error('Method not implemented.')
  }
  withEmail(s: WithInvitationEmail): void {
    throw new Error('Method not implemented.')
  }
  withRole(s: WithInvitationRole): void {
    const invitation = this.em.getReference(Invitation, this.id)
    wrap(invitation).assign({ role: s.role.unpack() })
    this.em.persist(invitation)
  }
  expiredAt(s: WithInvitationExpiredAt): void {
    const invitation = this.em.getReference(Invitation, this.id)
    wrap(invitation).assign({ expiredAt: s.expiredAt.value })
    this.em.persist(invitation)
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
