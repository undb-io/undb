import type { Option } from 'oxide.ts'
import type { InvitationSpecification } from './interface.js'
import type { Invitation } from './invitation.js'

export interface IInvitationRepository {
  findOne(spec: InvitationSpecification): Promise<Option<Invitation>>

  insert(invitation: Invitation): Promise<void>
  updateOneById(id: string, spec: InvitationSpecification): Promise<void>
}
