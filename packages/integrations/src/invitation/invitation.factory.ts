import { and } from '@undb/domain'
import type { InvitationSpecification } from './interface.js'
import { Invitation } from './invitation.js'
import { WithInvitationId } from './specifications/invitation-id.specification.js'

export class InvitationFactory {
  static create(...specs: InvitationSpecification[]): Invitation {
    return and(...specs)
      .unwrap()
      .mutate(Invitation.empty())
      .unwrap()
  }

  static invite() {
    return this.create(WithInvitationId.create())
  }
}
