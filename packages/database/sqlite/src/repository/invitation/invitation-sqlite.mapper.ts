import type { IRolesWithoutOwner } from '@undb/authz'
import { UserId } from '@undb/core'
import { DateVO } from '@undb/domain'
import type { IInvitationStatus, IQueryInvitation, Invitation as InvitationDo } from '@undb/integrations'
import {
  InvitationFactory,
  InvitationStatus,
  InvitationUserProfile,
  WithInvitationAcceptedAt,
  WithInvitationCancelledAt,
  WithInvitationCancelledBy,
  WithInvitationEmail,
  WithInvitationExpiredAt,
  WithInvitationId,
  WithInvitationInvitedAt,
  WithInvitationInvitedBy,
  WithInvitationInvitedByProfile,
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
      new WithInvitationInvitedByProfile(new InvitationUserProfile({ username: invitation.invitedBy.username })),
      new WithInvitationInvitedAt(new DateVO(invitation.invitedAt)),
      new WithInvitationCancelledBy(
        invitation.cancelledBy ? Some(UserId.from(invitation.cancelledBy.id).unwrap()) : None,
      ),
      new WithInvitationCancelledAt(invitation.cancelldAt ? Some(new DateVO(invitation.cancelldAt)) : None),
      new WithInvitationAcceptedAt(invitation.acceptedAt ? Some(new DateVO(invitation.acceptedAt)) : None),
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
      invitedByProfile: {
        username: invitation.invitedBy.username,
      },
      invitedAt: invitation.invitedAt.toISOString(),
      cancelledBy: invitation.cancelledBy?.id,
      cancelledAt: invitation.cancelldAt?.toISOString(),
      acceptedAt: invitation.acceptedAt?.toISOString(),
    }
  }
}
