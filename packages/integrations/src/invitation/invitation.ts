import type { Role } from '@undb/authz'
import type { EmailVO } from '@undb/domain'
import type { InvitationId } from './invitation-id.vo'
import type { InvitationExpiredAt } from './value-objects'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role
  expiredAt!: InvitationExpiredAt

  static empty() {
    return new Invitation()
  }
}
