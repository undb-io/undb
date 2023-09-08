import type { User } from '@undb/core'
import { and } from '@undb/domain'
import type { IRoles } from '../rbac/role.vo.js'
import type { MemberSpecification } from './interface.js'
import { Member } from './member.js'
import { WithMemberId } from './specifications/member-id.specification.js'
import { WithMemberRole } from './specifications/member-role.specification.js'
import { WithMemberUserId, WithMemberUserProfile } from './specifications/member-user-id.specification.js'

export class MemberFactory {
  static create(...specs: MemberSpecification[]): Member {
    return and(...specs)
      .unwrap()
      .mutate(Member.empty())
      .unwrap()
  }

  static grant(user: User, role: IRoles) {
    return this.create(
      WithMemberId.create(),
      new WithMemberUserId(user.userId),
      WithMemberRole.from(role),
      WithMemberUserProfile.fromUser(user),
    )
  }

  static owner(user: User) {
    return this.grant(user, 'owner')
  }
}
