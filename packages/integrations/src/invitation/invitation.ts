import { Role } from '@undb/authz'
import { and, type EmailVO } from '@undb/domain'
import type { InvitationSpecification } from './interface'
import type { InvitationId } from './invitation-id.vo'
import { WithInvitationExpiredAt, WithInvitationRole } from './specifications'
import type { InvitationExpiredAt } from './value-objects'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role
  expiredAt!: InvitationExpiredAt

  static empty() {
    return new Invitation()
  }

  public reinvite(role: string): InvitationSpecification {
    const specs: InvitationSpecification[] = []
    const roleVo = Role.fromStringWithoutOwner(role)
    if (!this.role.equals(roleVo)) {
      specs.push(new WithInvitationRole(roleVo))
    }

    specs.push(this.extend())

    return and(...specs).unwrap()
  }

  public extend(): InvitationSpecification {
    return WithInvitationExpiredAt.default()
  }
}
