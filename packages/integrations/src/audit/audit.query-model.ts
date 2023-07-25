import type { IQueryAudit } from './audit.type'
import type { AuditSpecification } from './specifications'

export interface IAuditQueryModel {
  find(spec: AuditSpecification): Promise<IQueryAudit[]>
}
