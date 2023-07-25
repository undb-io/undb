import type { TableId } from '@undb/core'
import type { DateVO } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { AuditDetail } from './audit-detail.vo.js'
import type { AuditId } from './audit-id.vo.js'
import type { AuditTarget } from './audit-target.vo.js'

export class Audit {
  public id!: AuditId
  public timestamp!: DateVO
  public detail!: Option<AuditDetail>
  public op!: string
  public target!: AuditTarget
  public tableId!: Option<TableId>
  public operatorId!: string

  static empty() {
    return new this()
  }
}
