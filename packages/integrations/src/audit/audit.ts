import type { AuditId } from './audit-id.vo.js'

export class Audit {
  id!: AuditId

  static empty() {
    return new this()
  }
}
