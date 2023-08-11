import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Invitation } from './invitation.js'
import type { WithInvitationId } from './specifications/invitation-id.specification.js'

export interface IInvitationVisitor extends ISpecVisitor {
  withInvitationId(s: WithInvitationId): void
}

export type InvitationSpecification = CompositeSpecification<Invitation, IInvitationVisitor>
