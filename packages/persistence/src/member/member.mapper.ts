import type { ISpaceMemberDTO, SpaceMember as SpaceMemberDo } from "@undb/authz"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { SpaceMember } from "../db"

@singleton()
export class MemberMapper implements Mapper<SpaceMemberDo, SpaceMember, ISpaceMemberDTO> {
  toDo(entity: SpaceMember): SpaceMemberDo {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: SpaceMemberDo): SpaceMember {
    return {
      id: domain.props.id,
      role: domain.props.role,
      space_id: domain.props.spaceId,
      user_id: domain.props.userId,
    }
  }
  toDTO(entity: SpaceMember): ISpaceMemberDTO {
    return {
      id: entity.id,
      role: entity.role,
      spaceId: entity.space_id,
      userId: entity.user_id,
    }
  }
}
