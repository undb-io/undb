import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IMemberVisitor, WithMemberId, WithMemberRole, WithMemberUserId } from '@undb/authz'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { Member } from '../../entity/member.js'

export class MemberSqliteQueryVisitor implements IMemberVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<Member>,
  ) {}
  withMemberId(s: WithMemberId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withMemberUserId(s: WithMemberUserId): void {
    this.qb.andWhere({ user: s.userId.value })
  }
  withMemberRole(s: WithMemberRole): void {
    this.qb.andWhere({ role: s.role })
  }
  or(left: ISpecification<Member, ISpecVisitor>, right: ISpecification<Member, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
