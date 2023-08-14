import type { IEvent } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { InvitationSpecification } from './interface.js'
import type { Invitation } from './invitation.js'

export interface IInvitationRepository {
  findOneById(id: string): Promise<Option<Invitation>>
  findOne(spec: InvitationSpecification): Promise<Option<Invitation>>

  insert(invitation: Invitation, event: IEvent): Promise<void>
  updateOneById(id: string, spec: InvitationSpecification): Promise<void>
}
