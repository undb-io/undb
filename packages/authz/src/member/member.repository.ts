import type { Member } from './member.js'

export interface IMemberRepository {
  insert(member: Member): Promise<void>
}
