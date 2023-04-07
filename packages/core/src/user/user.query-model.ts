import type { IQueryUser } from './user.type'

export interface IUserQueryModel {
  findOneById: (id: string) => Promise<IQueryUser>
}
