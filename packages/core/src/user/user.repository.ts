import type { Option } from 'oxide.ts'
import type { UserSpecification } from './specifications/interface.js'
import type { User } from './user.js'

export interface IUserRepository {
  findOneById(id: string): Promise<Option<User>>
  exists(spec: UserSpecification): Promise<boolean>
}
