import type { UserId } from '@undb/core'
import { None, Some, type Option } from 'oxide.ts'
import type { IRoles } from '../rbac/role.vo.js'
import { Role } from '../rbac/role.vo.js'
import type { MemberSpecification } from './interface.js'
import { WithMemberRole } from './specifications/member-role.specification.js'
import type { MemberID, MemberUserProfile } from './value-objects/index.js'

export class Member {
  id!: MemberID
  role!: Role
  userId!: UserId
  userProfile!: MemberUserProfile

  static empty() {
    return new this()
  }

  public updateRole(role: IRoles): Option<MemberSpecification> {
    // TODO: validate
    if (this.role.equals(Role.fromStringWithoutOwner(role))) {
      return None
    }
    return Some(WithMemberRole.from(role))
  }
}
