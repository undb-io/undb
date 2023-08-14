import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IMemberQueryModel, IQueryMember, MemberSpecification } from '@undb/authz'
import { type Option } from 'oxide.ts'
import { Member } from '../../entity/member.js'
import { MemberSqliteMapper } from './member-sqlite.mapper.js'
import { MemberSqliteQueryVisitor } from './member-sqlite.query-visitor.js'

export class MemberSqliteQueryModel implements IMemberQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: Option<MemberSpecification>): Promise<IQueryMember[]> {
    const em = this.em.fork()
    const qb = em.qb(Member)

    if (spec.isSome()) {
      const visitor = new MemberSqliteQueryVisitor(em, qb)
      spec.unwrap().accept(visitor)
    }

    const members = await qb.getResultList()
    await em.populate(members, ['user'])

    return members.map((member) => MemberSqliteMapper.toQuery(member))
  }
}
