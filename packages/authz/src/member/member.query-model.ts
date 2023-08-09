import type { Option } from 'oxide.ts'
import type { MemberSpecification } from './interface'
import type { IQueryMember } from './member.schema.js'

export interface IMemberQueryModel {
  find(spec: Option<MemberSpecification>): Promise<IQueryMember[]>
}
