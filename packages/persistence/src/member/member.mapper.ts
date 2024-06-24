import type { IWorkspaceMemberDTO, WorkspaceMember } from "@undb/authz"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { NewWorkspaceMember } from "../tables"

@singleton()
export class MemberMapper implements Mapper<WorkspaceMember, NewWorkspaceMember, IWorkspaceMemberDTO> {
  toDo(entity: NewWorkspaceMember): WorkspaceMember {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: WorkspaceMember): NewWorkspaceMember {
    return {
      id: domain.props.id,
      role: domain.props.role,
      workspaceId: domain.props.workspaceId,
      userId: domain.props.userId,
    }
  }
  toDTO(entity: NewWorkspaceMember): IWorkspaceMemberDTO {
    return {
      id: entity.id,
      role: entity.role,
      workspaceId: entity.workspaceId,
      userId: entity.userId,
    }
  }
}
