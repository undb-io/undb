import type { IRoles, Member as MemberDo } from '@undb/authz'
import { MemberFactory, WithMemberId, WithMemberRole, WithMemberUserId } from '@undb/authz'
import type { Member } from '../../entity/member.js'

export class MemberSqliteMapper {
  static toDomain(member: Member): MemberDo {
    return MemberFactory.create(
      WithMemberId.fromString(member.id),
      WithMemberUserId.fromString(member.user.id),
      WithMemberRole.from(member.role as IRoles),
    )
  }
}
