import { Role } from '@undb/authz'
import { and, type EmailVO } from '@undb/domain'
import type { InvitationSpecification } from './interface'
import type { InvitationId } from './invitation-id.vo'
import { WithInvitationExpiredAt, WithInvitationRole } from './specifications'
import type { InvitationExpiredAt, InvitationStatus } from './value-objects'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role
  expiredAt!: InvitationExpiredAt
  status!: InvitationStatus

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
    const activate = this.status.activate()
    if (activate.isSome()) {
      specs.push(activate.unwrap())
    }

    const spec = and(...specs).unwrap()

    spec.mutate(this)

    return spec
  }

  public extend(): InvitationSpecification {
    const spec = WithInvitationExpiredAt.default()

    spec.mutate(this)

    return spec
  }

  public cancel() {
    return this.status.cancel()
  }
}
