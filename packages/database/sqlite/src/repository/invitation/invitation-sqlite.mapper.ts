import type { IRolesWithoutOwner } from '@undb/authz'
import { UserId } from '@undb/core'
import type { IInvitationStatus, IQueryInvitation, Invitation as InvitationDo } from '@undb/integrations'
import {
  InvitationFactory,
  InvitationStatus,
  WithInvitationCancelledBy,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationInvitedBy,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import { None, Some } from 'oxide.ts'
import type { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteMapper {
  static toDomain(invitation: Invitation): InvitationDo {
    return InvitationFactory.create(
      WithInvitationId.fromString(invitation.id),
      WithInvitationEmail.fromString(invitation.email),
      WithInvitationRole.fromString(invitation.role),
      WithInvitationExpiredAt.fromDate(invitation.expiredAt),
      new WithInvitationStatus(InvitationStatus.fromString(invitation.status)),
      new WithInvitationInvitedBy(UserId.from(invitation.invitedBy.id).unwrap()),
      new WithInvitationCancelledBy(
        invitation.cancelledBy ? Some(UserId.from(invitation.cancelledBy.id).unwrap()) : None,
      ),
    )
  }

  static toQuery(invitation: Invitation): IQueryInvitation {
    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role as IRolesWithoutOwner,
      expiredAt: invitation.expiredAt.toISOString(),
      status: invitation.status as IInvitationStatus,
      invitedBy: invitation.invitedBy.id,
      cancelledBy: invitation.cancelledBy?.id,
    }
  }
}
