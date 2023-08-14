import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { User as CoreUser, IUserRepository, UserSpecification } from '@undb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { User } from '../../entity/user.js'
import { UserSqliteMapper } from './user-sqlite.mapper.js'
import { UserSqliteMutationVisitor } from './user-sqlite.mutation-visitor.js'
import { UserSqliteQueryVisitor } from './user-sqlite.query-visitor.js'

export class UserSqliteRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}
  async insert(user: CoreUser): Promise<void> {
    const entity = new User(user)
    await this.em.fork().persistAndFlush(entity)
  }

  async updateOneById(id: string, spec: UserSpecification): Promise<void> {
    const visitor = new UserSqliteMutationVisitor(id, this.em)
    spec.accept(visitor)

    await this.em.flush()
  }

  async findOneById(id: string): Promise<Option<CoreUser>> {
    const em = this.em.fork()
    const user = await em.findOne(User, id)
    if (!user) {
      return None
    }
    return Some(UserSqliteMapper.toDomain(user))
  }

  async findOne(spec: UserSpecification): Promise<Option<CoreUser>> {
    const em = this.em.fork()
    const qb = em.qb(User)
    const visitor = new UserSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const user = await qb.getSingleResult()
    if (!user) return None

    return Some(UserSqliteMapper.toDomain(user))
  }

  async exists(spec: UserSpecification): Promise<boolean> {
    const qb = this.em.qb(User)
    const visitor = new UserSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const user = await qb.getSingleResult()
    return !!user
  }

  async count(spec: UserSpecification | null): Promise<number> {
    const qb = this.em.qb(User)
    const visitor = new UserSqliteQueryVisitor(this.em, qb)

    spec?.accept(visitor)

    return qb.getCount()
  }
}
