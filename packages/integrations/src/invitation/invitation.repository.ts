import type { Invitation } from './invitation.js'

export interface IInvitationRepository {
  insert(invitation: Invitation): Promise<void>
}
