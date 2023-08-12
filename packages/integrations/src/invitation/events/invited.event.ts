import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import { inviteIdSchema } from '../invitation-id.vo.js'
import type { Invitation } from '../invitation.js'

export const EVT_INVITATION_INVITED = 'invitation.invited' as const

export const invitedEventPayload = z.object({
  id: inviteIdSchema,
})

export type IInvitedEventPayload = z.infer<typeof invitedEventPayload>

export class InvitedEvent extends BaseEvent<IInvitedEventPayload> {
  name = EVT_INVITATION_INVITED

  static from(invitation: Invitation, operatorId: string): InvitedEvent {
    return new this(
      {
        id: invitation.id.value,
      },
      operatorId,
      undefined,
    )
  }
}
