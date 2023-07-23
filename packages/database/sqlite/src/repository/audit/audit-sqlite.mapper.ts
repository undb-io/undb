import type { IQueryAudit } from '@undb/integrations'
import type { Audit } from '../../entity/audit.js'

export class AuditSqliteMapper {
  static toQuery(audit: Audit): IQueryAudit {
    return {
      id: audit.id,
      op: audit.op,
      operator: {
        userId: audit.operator.id,
        username: audit.operator.username,
        avatar: audit.operator.avatar ?? null,
        color: audit.operator.color,
      },
      target: {
        id: audit.targetId ?? '',
        type: audit.targetType ?? ('' as any),
      },
      timestamp: audit.timestamp.toISOString(),
      detail: audit.detail ?? null,
    }
  }
}
