import type { User } from '@undb/core'
import type { IRoles } from '../../rbac/role.vo.js'
import { MemberFactory } from '../member.factory.js'
import type { IMemberRepository } from '../member.repository.js'

export interface IMemberCreateService {
  grant(user: User, role: IRoles): Promise<void>
  grantDefault(user: User): Promise<void>
}

export class MemberCreateService implements IMemberCreateService {
  constructor(protected readonly memberRepo: IMemberRepository) {}
  async grant(user: User, role: IRoles): Promise<void> {
    const member = MemberFactory.grant(user, role)
    await this.memberRepo.insert(member)
  }

  async grantDefault(user: User): Promise<void> {
    const count = await this.memberRepo.count()
    const role: IRoles = count === 0 ? 'owner' : 'admin'
    await this.grant(user, role)
  }
}
