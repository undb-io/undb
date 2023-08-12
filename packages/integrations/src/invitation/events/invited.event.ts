import { BaseEvent } from '@undb/domain'
import type { Invitation } from '../invitation.js'

export class InvitedEvent extends BaseEvent {
  name = 'invitation.invited'

  static from(invitation: Invitation): InvitedEvent {
    throw new Error()
  }
}
