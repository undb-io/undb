import type { IQueryUser } from './user.js'

export interface IUserQueryModel {
  findOneById: (id: string) => Promise<IQueryUser>
}
