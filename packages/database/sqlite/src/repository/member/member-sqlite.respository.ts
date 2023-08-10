import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IMemberRepository, Member as MemberDO, MemberSpecification } from '@undb/authz'
import { None, Some, type Option } from 'oxide.ts'
import { Member } from '../../entity/member.js'
import { User } from '../../entity/user.js'
import { MemberSqliteMapper } from './member-sqlite.mapper.js'
import { MemberSqliteMutationVisitor } from './member-sqlite.mutation-visitor.js'
import { MemberSqliteQueryVisitor } from './member-sqlite.query-visitor.js'

export class MemberSqliteRepository implements IMemberRepository {
  constructor(protected readonly em: EntityManager) {}
  async findOneById(id: string): Promise<Option<MemberDO>> {
    const entity = await this.em.findOne(Member, id)
    if (!entity) return None

    return Some(MemberSqliteMapper.toDomain(entity))
  }

  async updateOneById(id: string, spec: MemberSpecification): Promise<void> {
    const em = this.em.fork()
    const visitor = new MemberSqliteMutationVisitor(id, em)
    spec.accept(visitor)

    await em.flush()
  }

  async findOne(spec: MemberSpecification): Promise<Option<MemberDO>> {
    const em = this.em.fork()
    const qb = em.qb(Member)
    const visitor = new MemberSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const member = await qb.getSingleResult()
    if (!member) return None
    await em.populate(member, ['user'])

    return Some(MemberSqliteMapper.toDomain(member))
  }

  async insert(member: MemberDO): Promise<void> {
    const em = this.em.fork()
    const user = em.getReference(User, member.userId.value)

    const entity = new Member(member, user)
    await this.em.insert(entity)
  }

  count(): Promise<number> {
    return this.em.count(Member)
  }
}
