import type { Audit } from './audit'

export interface IAuditRepository {
  insert(audit: Audit): Promise<void>
}
