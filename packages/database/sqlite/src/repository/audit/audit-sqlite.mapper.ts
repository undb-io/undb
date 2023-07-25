import {
  AuditFactory,
  AuditTarget,
  WithAuditDetail,
  WithAuditId,
  WithAuditOp,
  WithAuditOperator,
  WithAuditTableId,
  WithAuditTarget,
  WithAuditTimestamp,
  type Audit as AuditDO,
  type IQueryAudit,
} from '@undb/integrations'
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

  static toDomain(audit: Audit): AuditDO {
    return AuditFactory.create(
      WithAuditId.fromString(audit.id),
      WithAuditTimestamp.fromDate(audit.timestamp),
      new WithAuditOp(audit.op),
      new WithAuditOperator(audit.operator.id),
      WithAuditDetail.from(audit.detail ?? null),
      WithAuditTableId.from(audit.table?.id ?? ''),
      new WithAuditTarget(new AuditTarget({ type: audit.targetType! as any, id: audit.targetId! })),
    )
  }
}
