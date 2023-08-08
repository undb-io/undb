import type { ClsStore, IClsService } from '@undb/core'
import type { Permission } from '../../rbac/permissions.js'
import type { IMemberRepository } from '../member.repository.js'
import { WithMemberUserId } from '../specifications/index.js'

export interface IMemberService {
  setCurrentMember(): Promise<void>
  verify(permissions: Permission[]): Promise<boolean>
}

export class MemberService implements IMemberService {
  constructor(
    protected readonly cls: IClsService<ClsStore>,
    protected readonly repo: IMemberRepository,
  ) {}

  async setCurrentMember(): Promise<void> {
    const userId = this.cls.get('user.userId')
    const member = await this.repo.findOne(WithMemberUserId.fromString(userId))
    if (member.isNone()) return

    this.cls.set('member.memberId', member.unwrap().id.value)
    this.cls.set('member.role', member.unwrap().role.unpack())
  }

  async verify(permissions: Permission[]): Promise<boolean> {
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    console.log({ permissions })
    return true
  }
}
