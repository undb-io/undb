import type { DateVO } from '@undb/domain'
import type { AuditId } from './audit-id.vo.js'
import type { AuditTarget } from './audit-target.vo.js'

export class Audit {
  public id!: AuditId
  public timestamp!: DateVO
  public op!: string
  public target!: AuditTarget

  static empty() {
    return new this()
  }
}
