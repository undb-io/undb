import { Role } from '@undb/authz'
import type { User } from '@undb/core'
import { EmailVO, and } from '@undb/domain'
import type { InvitationSpecification } from './interface.js'
import { Invitation } from './invitation.js'
import { WithInvitationEmail } from './specifications/invitation-email.specification.js'
import { WithInvitationExpiredAt } from './specifications/invitation-expired-at.specification.js'
import { WithInvitationId } from './specifications/invitation-id.specification.js'
import { WithInvitationInvitedAt } from './specifications/invitation-invited-at.specification.js'
import {
  WithInvitationInvitedBy,
  WithInvitationInvitedByProfile,
} from './specifications/invitation-invited-by.specification.js'
import { WithInvitationRole } from './specifications/invitation-role.specification.js'
import { WithInvitationStatus } from './specifications/invitation-status.specification.js'

export class InvitationFactory {
  static create(...specs: InvitationSpecification[]): Invitation {
    return and(...specs)
      .unwrap()
      .mutate(Invitation.empty())
      .unwrap()
  }

  static invite(email: string, role: string, user: User) {
    return this.create(
      WithInvitationId.create(),
      new WithInvitationEmail(EmailVO.fromString(email)),
      new WithInvitationRole(Role.fromString(role)),
      WithInvitationExpiredAt.default(),
      WithInvitationStatus.pending(),
      new WithInvitationInvitedBy(user.userId),
      WithInvitationInvitedByProfile.fromUser(user),
      WithInvitationInvitedAt.now(),
    )
  }
}
