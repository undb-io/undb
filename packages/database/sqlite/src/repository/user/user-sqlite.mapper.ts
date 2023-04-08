import type { IQueryUser } from '@egodb/core'
import { User as CoreUser } from '@egodb/core'
import type { User } from '../../entity/user.js'

export class UserSqliteMapper {
  static toQuery(user: User): IQueryUser {
    return {
      username: user.username,
      email: user.email,
      userId: user.id,
    }
  }

  static toDomain(user: User): CoreUser {
    return new CoreUser(user.id, user.username, user.email)
  }
}
