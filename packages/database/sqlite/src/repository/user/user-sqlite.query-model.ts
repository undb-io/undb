import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryUser, IUserQueryModel, UserSpecification } from '@undb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { User } from '../../entity/user.js'
import { UserSqliteMapper } from './user-sqlite.mapper.js'
import { UserSqliteQueryVisitor } from './user-sqlite.query-visitor.js'

export class UserSqliteQueryModel implements IUserQueryModel {
  constructor(protected readonly em: EntityManager) {}
  async find(spec: Option<UserSpecification>): Promise<IQueryUser[]> {
    const qb = this.em.qb(User)
    const visitor = new UserSqliteQueryVisitor(this.em, qb)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }
    const users = await qb.getResult()

    return users.map((user) => UserSqliteMapper.toQuery(user))
  }

  async findOneById(id: string): Promise<Option<IQueryUser>> {
    const user = await this.em.findOne(User, id)
    if (!user) {
      return None
    }
    return Some(UserSqliteMapper.toQuery(user))
  }

  async findOne(spec: UserSpecification): Promise<Option<IQueryUser>> {
    const qb = this.em.qb(User)
    const visitor = new UserSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const user = await qb.getSingleResult()
    if (!user) return None

    return Some(UserSqliteMapper.toQuery(user))
  }
}
