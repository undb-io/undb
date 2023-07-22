import type { IQueryAudit } from '@undb/integrations'
import type { Audit } from '../../entity/audit.js'

export class AuditSqliteMapper {
  static toQuery(audit: Audit): IQueryAudit {
    return {
      id: audit.id,
      op: audit.op,
      operator: {} as any,
      target: {
        id: audit.targetId ?? '',
        type: audit.targetType ?? ('' as any),
      },
      timestamp: audit.timestamp,
    }
  }
}
