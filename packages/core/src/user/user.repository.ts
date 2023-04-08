import type { Option } from 'oxide.ts'
import type { UserSpecification } from './specifications/interface.js'
import type { User } from './user.js'

export interface IUserRepository {
  insert(user: User): Promise<void>
  findOneById(id: string): Promise<Option<User>>
  findOne(spec: UserSpecification): Promise<Option<User>>
  exists(spec: UserSpecification): Promise<boolean>
}
