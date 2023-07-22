import type { DateVO } from '@undb/domain'
import type { AuditId } from './audit-id.vo.js'

export class Audit {
  public id!: AuditId
  public timestamp!: DateVO

  static empty() {
    return new this()
  }
}
