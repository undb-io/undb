import type { User as CoreUser, IQueryUser } from '@egodb/core'
import { UserFactory } from '@egodb/core'
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
    return UserFactory.unsafeCreate({
      email: user.email,
      userId: user.id,
      username: user.username,
      password: user.password,
    })
  }
}
