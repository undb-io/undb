import type { InvitationId } from './invitation-id.vo'

export class Invitation {
  id!: InvitationId

  static empty() {
    return new Invitation()
  }
}
