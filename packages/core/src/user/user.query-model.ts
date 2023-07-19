import type { Option } from 'oxide.ts'
import type { UserSpecification } from './specifications'
import type { IQueryUser } from './user.type'

export interface IUserQueryModel {
  findOneById: (id: string) => Promise<Option<IQueryUser>>
  findOne: (spec: UserSpecification) => Promise<Option<IQueryUser>>
  find: (spec: Option<UserSpecification>) => Promise<IQueryUser[]>
}
