import type { Option } from 'oxide.ts'
import type { MemberSpecification } from './interface.js'
import type { Member } from './member.js'

export interface IMemberRepository {
  findOne(spec: MemberSpecification): Promise<Option<Member>>
  findOneById(id: string): Promise<Option<Member>>
  updateOneById(id: string, spec: MemberSpecification): Promise<void>
  insert(member: Member): Promise<void>
  count(): Promise<number>
}
