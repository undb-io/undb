import { Role } from '@undb/authz'
import { UserId } from '@undb/core'
import { and, andOptions, type EmailVO } from '@undb/domain'
import { Some, type Option } from 'oxide.ts'
import type { InvitationSpecification } from './interface'
import type { InvitationId } from './invitation-id.vo'
import {
  WithInvitationCancelledBy,
  WithInvitationExpiredAt,
  WithInvitationInvitedBy,
  WithInvitationRole,
} from './specifications'
import type { InvitationExpiredAt, InvitationStatus } from './value-objects'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role
  expiredAt!: InvitationExpiredAt
  status!: InvitationStatus
  invitedBy!: UserId
  cancelledBy!: Option<UserId>

  static empty() {
    return new Invitation()
  }

  public reinvite(role: string, userId: string): InvitationSpecification {
    const specs: InvitationSpecification[] = []
    const roleVo = Role.fromStringWithoutOwner(role)
    if (!this.role.equals(roleVo)) {
      specs.push(new WithInvitationRole(roleVo))
      specs.push(new WithInvitationInvitedBy(UserId.from(userId).unwrap()))
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

  public cancel(userId: string) {
    const spec = this.status.cancel()
    if (spec.isSome()) {
      return andOptions(spec, Some(new WithInvitationCancelledBy(Some(UserId.from(userId).unwrap()))))
    }
    return spec
  }
}
