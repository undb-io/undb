import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Invitation } from './invitation.js'
import type { WithInvitationCancelledBy } from './specifications/invitation-cancelled-by.specification.js'
import type { WithInvitationEmail } from './specifications/invitation-email.specification.js'
import type { WithInvitationExpiredAt } from './specifications/invitation-expired-at.specification.js'
import type { WithInvitationId } from './specifications/invitation-id.specification.js'
import type { WithInvitationInvitedBy } from './specifications/invitation-invited-by.specification.js'
import type { WithInvitationRole } from './specifications/invitation-role.specification.js'
import type { WithInvitationStatus } from './specifications/invitation-status.specification.js'

export interface IInvitationVisitor extends ISpecVisitor {
  withInvitationId(s: WithInvitationId): void
  withEmail(s: WithInvitationEmail): void
  withRole(s: WithInvitationRole): void
  expiredAt(s: WithInvitationExpiredAt): void
  withStatus(s: WithInvitationStatus): void
  invitedBy(s: WithInvitationInvitedBy): void
  cancelledBy(s: WithInvitationCancelledBy): void
}

export type InvitationSpecification = CompositeSpecification<Invitation, IInvitationVisitor>
