import type { Role } from '@undb/authz'
import type { EmailVO } from '@undb/domain'
import type { InvitationId } from './invitation-id.vo'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role

  static empty() {
    return new Invitation()
  }
}
