import type { IQueryMember, IRoles, Member as MemberDo } from '@undb/authz'
import {
  MemberFactory,
  MemberUserProfile,
  WithMemberId,
  WithMemberRole,
  WithMemberUserId,
  WithMemberUserProfile,
} from '@undb/authz'
import type { Member } from '../../entity/member.js'

export class MemberSqliteMapper {
  static toDomain(member: Member): MemberDo {
    return MemberFactory.create(
      WithMemberId.fromString(member.id),
      WithMemberUserId.fromString(member.user.id),
      WithMemberRole.from(member.role as IRoles),
      new WithMemberUserProfile(
        new MemberUserProfile({
          avatar: member.user.avatar ?? null,
          color: member.user.color,
          username: member.user.username,
          email: member.user.email,
        }),
      ),
    )
  }

  static toQuery(member: Member): IQueryMember {
    return {
      id: member.id,
      role: member.role as IRoles,
      userId: member.user.id,
      userProfile: {
        avatar: member.user.avatar ?? null,
        color: member.user.color,
        username: member.user.username,
        email: member.user.email,
      },
    }
  }
}
