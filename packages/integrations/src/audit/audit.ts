import type { DateVO } from '@undb/domain/dist/index.js'
import type { AuditId } from './audit-id.vo.js'

export class Audit {
  public id!: AuditId
  public timestamp!: DateVO

  static empty() {
    return new this()
  }
}
