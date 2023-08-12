import type { Invitation } from '../invitation.js'

export interface IInvitationMailService {
  send(invitation: Invitation): Promise<void>
}
