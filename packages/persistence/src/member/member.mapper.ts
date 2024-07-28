import type { IWorkspaceMemberDTO, WorkspaceMember as WorkspaceMemberDo } from "@undb/authz"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { WorkspaceMember } from "../db"

@singleton()
export class MemberMapper implements Mapper<WorkspaceMemberDo, WorkspaceMember, IWorkspaceMemberDTO> {
  toDo(entity: WorkspaceMember): WorkspaceMemberDo {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: WorkspaceMemberDo): WorkspaceMember {
    return {
      id: domain.props.id,
      role: domain.props.role,
      user_id: domain.props.userId,
    }
  }
  toDTO(entity: WorkspaceMember): IWorkspaceMemberDTO {
    return {
      id: entity.id,
      role: entity.role,
      userId: entity.user_id,
    }
  }
}
