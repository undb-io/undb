import type { Audit as AuditDo } from "@undb/audit"
import type { IAuditDTO } from "@undb/audit/src/dto/audit.dto"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { Audit } from "../tables"

@singleton()
export class AuditMapper implements Mapper<AuditDo, Audit, IAuditDTO> {
  toDo(entity: Audit): AuditDo {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: AuditDo): Audit {
    return {
      id: domain.id.value,
      timestamp: domain.timestamp.value,
      detail: domain.detail.into(null)?.value ?? null,
      op: domain.op,
      tableId: domain.tableId.value,
      recordId: domain.recordId.value,
      operatorId: domain.operatorId!,
    }
  }
  toDTO(entity: Audit): IAuditDTO {
    return {
      id: entity.id,
      timestamp: entity.timestamp.toISOString(),
      detail: entity.detail,
      op: entity.op,
      tableId: entity.tableId,
      recordId: entity.recordId,
      operatorId: entity.operatorId,
    }
  }
}
