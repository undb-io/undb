import { and } from '@undb/domain'
import type { MemberSpecification } from './interface.js'
import { Member } from './member.js'

export class MemberFactory {
  static create(...specs: MemberSpecification[]): Member {
    return and(...specs)
      .unwrap()
      .mutate(Member.empty())
      .unwrap()
  }
}
