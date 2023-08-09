import type { IQueryMember, IRoles, Member as MemberDo } from '@undb/authz'
import { MemberFactory, WithMemberId, WithMemberRole, WithMemberUserId, WithMemberUserProfile } from '@undb/authz'
import type { Member } from '../../entity/member.js'

export class MemberSqliteMapper {
  static toDomain(member: Member): MemberDo {
    return MemberFactory.create(
      WithMemberId.fromString(member.id),
      WithMemberUserId.fromString(member.user.id),
      WithMemberRole.from(member.role as IRoles),
      new WithMemberUserProfile({
        color: member.user.color,
        avatar: member.user.avatar ?? null,
        username: member.user.username,
      }),
    )
  }

  static toQuery(member: Member): IQueryMember {
    return {
      id: member.id,
      role: member.role as IRoles,
      userId: member.user.id,
      userProfile: {
        color: member.user.color,
        avatar: member.user.avatar ?? null,
        username: member.user.username,
      },
    }
  }
}
