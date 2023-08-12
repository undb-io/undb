import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Invitation } from './invitation.js'
import type { WithInvitationEmail } from './specifications/invitation-email.specification.js'
import type { WithInvitationExpiredAt } from './specifications/invitation-expired-at.specification.js'
import type { WithInvitationId } from './specifications/invitation-id.specification.js'
import type { WithInvitationRole } from './specifications/invitation-role.specification.js'

export interface IInvitationVisitor extends ISpecVisitor {
  withInvitationId(s: WithInvitationId): void
  withEmail(s: WithInvitationEmail): void
  withRole(s: WithInvitationRole): void
  expiredAt(s: WithInvitationExpiredAt): void
}

export type InvitationSpecification = CompositeSpecification<Invitation, IInvitationVisitor>
