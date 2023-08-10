import type { ICollaboratorProfile, UserId } from '@undb/core'
import { Some, type Option } from 'oxide.ts'
import type { IRoles, Role } from '../rbac/role.vo.js'
import type { MemberSpecification } from './interface.js'
import { WithMemberRole } from './specifications/member-role.specification.js'
import type { MemberID } from './value-objects/index.js'

export class Member {
  id!: MemberID
  role!: Role
  userId!: UserId
  userProfile!: Option<ICollaboratorProfile>

  static empty() {
    return new this()
  }

  public updateRole(role: IRoles): Option<MemberSpecification> {
    // TODO: validate
    return Some(WithMemberRole.from(role))
  }
}
