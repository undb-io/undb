import type { IQueryInvitation } from './invitation.schema'

export interface IInvitationQueryModel {
  find(): Promise<IQueryInvitation[]>
}
