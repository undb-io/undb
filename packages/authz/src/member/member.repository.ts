import type { Option } from 'oxide.ts'
import type { MemberSpecification } from './interface.js'
import type { Member } from './member.js'

export interface IMemberRepository {
  findOne(spec: MemberSpecification): Promise<Option<Member>>
  insert(member: Member): Promise<void>
  count(): Promise<number>
}
