import type { Option } from 'oxide.ts'
import type { User } from './user.js'

export interface IUserRepository {
  findOneById(id: string): Promise<Option<User>>
}
