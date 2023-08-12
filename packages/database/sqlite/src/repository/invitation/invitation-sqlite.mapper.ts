import type { IRolesWithoutOwner } from '@undb/authz'
import type { IInvitationStatus, IQueryInvitation, Invitation as InvitationDo } from '@undb/integrations'
import {
  InvitationFactory,
  InvitationStatus,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationRole,
  WithInvitationStatus,
} from '@undb/integrations'
import type { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteMapper {
  static toDomain(invitation: Invitation): InvitationDo {
    return InvitationFactory.create(
      WithInvitationId.fromString(invitation.id),
      WithInvitationEmail.fromString(invitation.email),
      WithInvitationRole.fromString(invitation.role),
      WithInvitationExpiredAt.fromDate(invitation.expiredAt),
      new WithInvitationStatus(InvitationStatus.fromString(invitation.status)),
    )
  }

  static toQuery(invitation: Invitation): IQueryInvitation {
    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role as IRolesWithoutOwner,
      expiredAt: invitation.expiredAt.toISOString(),
      status: invitation.status as IInvitationStatus,
    }
  }
}
