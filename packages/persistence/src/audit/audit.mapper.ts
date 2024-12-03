import type { Audit as AuditDo } from "@undb/audit"
import type { IAuditDTO } from "@undb/audit/src/dto/audit.dto"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { pick } from "radash"
import type { Audit } from "../db"
import { json } from "../qb.util"

@singleton()
export class AuditMapper implements Mapper<AuditDo, Audit, IAuditDTO> {
  toDo(entity: Audit): AuditDo {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: AuditDo): Audit {
    const detail = domain.detail.into(null)
    const meta = domain.meta.into(null)
    return {
      id: domain.id.value,
      timestamp: domain.timestamp.value.toISOString(),
      detail: detail ? json(detail.value) : null,
      meta: meta ? json(pick(meta, ["table"])) : null,
      op: domain.op,
      table_id: domain.tableId.value,
      record_id: domain.recordId.value,
      operator_id: domain.operatorId!,
    }
  }
  toDTO(entity: Audit): IAuditDTO {
    return {
      id: entity.id,
      timestamp: entity.timestamp,
      detail: entity.detail,
      meta: entity.meta,
      op: entity.op,
      tableId: entity.table_id,
      recordId: entity.record_id,
      operatorId: entity.operator_id,
    }
  }
}
