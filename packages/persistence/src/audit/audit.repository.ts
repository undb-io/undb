import type { Audit, AuditSpecification, IAuditRepository } from "@undb/audit"
import { inject, singleton } from "@undb/di"
import type { IUnitOfWork, Option } from "@undb/domain"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { audit as auditTable } from "../tables"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"
import { AuditMapper } from "./audit.mapper"

@singleton()
export class AuditRepository implements IAuditRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(AuditMapper)
    private readonly mapper: AuditMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}
  findOne(spec: AuditSpecification): Promise<Option<Audit>> {
    throw new Error("Method not implemented.")
  }
  async insert(audit: Audit): Promise<void> {
    const values = this.mapper.toEntity(audit)

    await this.db.insert(auditTable).values(values)
  }
  updateOneById(id: string, spec: AuditSpecification): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
