import type { Option } from 'oxide.ts'
import type { InvitationSpecification } from './interface'
import type { IQueryInvitation } from './invitation.schema'

export interface IInvitationQueryModel {
  find(spec: Option<InvitationSpecification>): Promise<IQueryInvitation[]>
  findOneById(id: string): Promise<Option<IQueryInvitation>>
}
