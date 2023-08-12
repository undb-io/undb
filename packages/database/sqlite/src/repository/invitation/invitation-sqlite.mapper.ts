import type { IRolesWithoutOwner } from '@undb/authz'
import type { IQueryInvitation, Invitation as InvitationDo } from '@undb/integrations'
import {
  InvitationFactory,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationRole,
} from '@undb/integrations'
import type { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteMapper {
  static toDomain(invitation: Invitation): InvitationDo {
    return InvitationFactory.create(
      WithInvitationId.fromString(invitation.id),
      WithInvitationEmail.fromString(invitation.email),
      WithInvitationRole.fromString(invitation.role),
      WithInvitationExpiredAt.fromDate(invitation.expiredAt),
    )
  }

  static toQuery(invitation: Invitation): IQueryInvitation {
    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role as IRolesWithoutOwner,
      expiredAt: invitation.expiredAt.toISOString(),
    }
  }
}
