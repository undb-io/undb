import type { Option } from 'oxide.ts'
import type { IQueryUser } from './user.type'

export interface IUserQueryModel {
  findOneById: (id: string) => Promise<Option<IQueryUser>>
}
