import { Role } from '@undb/authz'
import { UserId } from '@undb/core'
import type { DateVO } from '@undb/domain'
import { and, andOptions, type EmailVO } from '@undb/domain'
import { isAfter } from 'date-fns'
import { Some, type Option } from 'oxide.ts'
import type { InvitationSpecification } from './interface.js'
import type { InvitationId } from './invitation-id.vo.js'
import { InvitationAccepted, InvitationExpired } from './invitation.errors.js'
import {
  WithInvitationAcceptedAt,
  WithInvitationCancelledBy,
  WithInvitationExpiredAt,
  WithInvitationInvitedAt,
  WithInvitationInvitedBy,
  WithInvitationRole,
} from './specifications/index.js'
import { WithInvitationCancelledAt } from './specifications/invitation-cancelled-at.specification.js'
import type { InvitationExpiredAt, InvitationStatus, InvitationUserProfile } from './value-objects/index.js'

export class Invitation {
  id!: InvitationId
  email!: EmailVO
  role!: Role
  expiredAt!: InvitationExpiredAt
  status!: InvitationStatus
  invitedBy!: UserId
  invitedByProfile!: InvitationUserProfile
  invitedAt!: DateVO
  cancelledBy!: Option<UserId>
  cancelledAt!: Option<DateVO>
  acceptedAt!: Option<DateVO>

  static empty() {
    return new Invitation()
  }

  public reinvite(role: string, userId: string): InvitationSpecification {
    if (this.status.isAccepted) {
      throw new InvitationAccepted()
    }

    const specs: InvitationSpecification[] = []
    const roleVo = Role.fromStringWithoutOwner(role)
    if (!this.role.equals(roleVo)) {
      specs.push(new WithInvitationRole(roleVo))
      specs.push(new WithInvitationInvitedBy(UserId.from(userId).unwrap()))
      specs.push(WithInvitationInvitedAt.now())
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

  public get isExpired(): boolean {
    return isAfter(new Date(), this.expiredAt.value)
  }

  public extend(): InvitationSpecification {
    const spec = WithInvitationExpiredAt.default()

    spec.mutate(this)

    return spec
  }

  public cancel(userId: string) {
    const spec = this.status.cancel()
    if (spec.isSome()) {
      return andOptions(
        spec,
        Some(new WithInvitationCancelledBy(Some(UserId.from(userId).unwrap()))),
        Some(WithInvitationCancelledAt.now()),
      )
    }
    return spec
  }

  public accept() {
    if (this.isExpired && !this.status.isAccepted) {
      throw new InvitationExpired(this.expiredAt.value)
    }
    return andOptions(this.status.accept(), Some(WithInvitationAcceptedAt.now()))
  }
}
