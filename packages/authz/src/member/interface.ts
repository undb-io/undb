import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Member } from './member.js'
import type { WithMemberId } from './specifications/member-id.specification.js'
import type { WithMemberRole } from './specifications/member-role.specification.js'
import type { WithMemberUserId } from './specifications/member-user-id.specification.js'

export interface IMemberVisitor extends ISpecVisitor {
  withMemberId(s: WithMemberId): void
  withMemberUserId(s: WithMemberUserId): void
  withMemberRole(s: WithMemberRole): void
}

export type MemberSpecification = CompositeSpecification<Member, IMemberVisitor>
