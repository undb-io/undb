import { inject } from "@undb/di"
import type { Option } from "oxide.ts"
import type { Audit } from "./audit"
import type { IAuditDTO } from "./dto/audit.dto"
import type { AuditSpecification } from "./specifications"

export interface IAuditRepository {
  findOne(spec: AuditSpecification): Promise<Option<Audit>>
  insert(audit: Audit): Promise<void>
  updateOneById(id: string, spec: AuditSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const AUDIT_REPOSITORY = Symbol("AUDIT_REPOSITORY")

export const injectAuditRepository = () => inject(AUDIT_REPOSITORY)

export interface IAuditQueryRepository {
  find(spec: AuditSpecification): Promise<IAuditDTO[]>
}

export const AUDIT_QUERY_REPOSITORY = Symbol("AUDIT_QUERY_REPOSITORY")

export const injectAuditQueryRepository = () => inject(AUDIT_QUERY_REPOSITORY)
