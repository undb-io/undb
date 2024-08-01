import type { DateVO } from "@undb/domain"
import type { RECORD_EVENTS, RecordId, TableId } from "@undb/table"
import type { Option } from "oxide.ts"
import type { AuditDetail } from "./audit-detail.vo.js"
import type { AuditId } from "./audit-id.vo.js"

export class Audit {
  public id!: AuditId
  public timestamp!: DateVO
  public detail!: Option<AuditDetail>
  public meta!: Option<Record<string, unknown>>
  public op!: RECORD_EVENTS
  public tableId!: TableId
  public recordId!: RecordId
  public operatorId!: string

  static empty() {
    return new this()
  }
}
