import type { IQueryUser } from '@egodb/core'
import type { User } from '../../entity/user'

export class UserSqliteMapper {
  static toQuery(user: User): IQueryUser {
    return {
      username: user.username,
      userId: user.id,
    }
  }
}
