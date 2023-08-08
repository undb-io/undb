import type { UserId } from '@undb/core'
import type { Role } from '../rbac/role.vo.js'
import type { MemberID } from './value-objects/index.js'

export class Member {
  id!: MemberID
  role!: Role
  userId!: UserId

  static empty() {
    return new this()
  }
}
