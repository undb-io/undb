import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IMemberVisitor, WithMemberId, WithMemberRole, WithMemberUserId, WithMemberUserLike } from '@undb/authz'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import { Member } from '../../entity/member.js'

export class MemberSqliteMutationVisitor implements IMemberVisitor {
  constructor(
    private readonly memberId: string,
    private readonly em: EntityManager,
  ) {}
  userLike(s: WithMemberUserLike): void {
    throw new Error('Method not implemented.')
  }
  withMemberId(s: WithMemberId): void {
    throw new Error('Method not implemented.')
  }
  withMemberUserId(s: WithMemberUserId): void {
    throw new Error('Method not implemented.')
  }
  withMemberRole(s: WithMemberRole): void {
    const member = this.em.getReference(Member, this.memberId)
    wrap(member).assign({ role: s.role.unpack() })
    this.em.persist(member)
  }
  or(left: ISpecification<Member, ISpecVisitor>, right: ISpecification<Member, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
