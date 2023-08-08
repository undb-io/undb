import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IMemberRepository, Member as MemberDO } from '@undb/authz'
import { Member } from '../../entity/member.js'
import { User } from '../../entity/user.js'

export class MemberSqliteRepository implements IMemberRepository {
  constructor(protected readonly em: EntityManager) {}
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
