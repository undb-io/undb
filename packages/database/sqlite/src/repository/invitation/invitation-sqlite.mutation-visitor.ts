import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type {
  IInvitationVisitor,
  WithInvitationCancelledBy,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationInvitedBy,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import { Invitation } from '../../entity/invitation.js'
import { User } from '../../entity/user.js'

export class InvitationSqliteMutationVisitor implements IInvitationVisitor {
  constructor(
    public readonly id: string,
    public readonly em: EntityManager,
  ) {}
  invitedBy(s: WithInvitationInvitedBy): void {
    const invitation = this.em.getReference(Invitation, this.id)
    const user = this.em.getReference(User, s.invitedBy.value)
    wrap(invitation).assign({ invitedBy: user })
    this.em.persist(invitation)
  }
  cancelledBy(s: WithInvitationCancelledBy): void {
    const invitation = this.em.getReference(Invitation, this.id)
    const cancelledBy = s.cancelledBy.into(null)
    const user = cancelledBy ? this.em.getReference(User, cancelledBy.value) : null
    wrap(invitation).assign({ cancelledBy: user })
    this.em.persist(invitation)
  }
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
