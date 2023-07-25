import type { Option } from 'oxide.ts'
import type { Audit } from './audit'
import type { AuditSpecification } from './specifications'

export interface IAuditRepository {
  findOne(spec: AuditSpecification): Promise<Option<Audit>>
  insert(audit: Audit): Promise<void>
  updateOneById(id: string, spec: AuditSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}
