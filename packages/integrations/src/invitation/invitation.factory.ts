import { Role } from '@undb/authz'
import { EmailVO, and } from '@undb/domain'
import type { InvitationSpecification } from './interface.js'
import { Invitation } from './invitation.js'
import { WithInvitationEmail } from './specifications/invitation-email.specification.js'
import { WithInvitationId } from './specifications/invitation-id.specification.js'
import { WithInvitationRole } from './specifications/invitation-role.specification.js'

export class InvitationFactory {
  static create(...specs: InvitationSpecification[]): Invitation {
    return and(...specs)
      .unwrap()
      .mutate(Invitation.empty())
      .unwrap()
  }

  static invite(email: string, role: string) {
    return this.create(
      WithInvitationId.create(),
      new WithInvitationEmail(EmailVO.fromString(email)),
      new WithInvitationRole(Role.fromString(role)),
    )
  }
}
