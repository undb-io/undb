import type { User as CoreUser, IUserRepository, UserSpecification } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { User } from '../../entity/user.js'
import { UserSqliteMapper } from './user-sqlite.mapper.js'
import { UserSqliteQueryVisitor } from './user-sqlite.query-visitor.js'

export class UserSqliteRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<CoreUser>> {
    const user = await this.em.findOne(User, id)
    if (!user) {
      return None
    }
    return Some(UserSqliteMapper.toDomain(user))
  }

  async exists(spec: UserSpecification): Promise<boolean> {
    const qb = this.em.qb(User)
    const visitor = new UserSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const user = await qb.getSingleResult()
    return !!user
  }
}
