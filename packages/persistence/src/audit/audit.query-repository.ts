import type { AuditSpecification, IAuditDTO, IAuditQueryRepository } from "@undb/audit"
import { inject, singleton } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { audit } from "../tables"
import { injectDbUnitOfWork } from "../uow"
import { AuditFilterVisitor } from "./audit.filter-visitor"
import { AuditMapper } from "./audit.mapper"

@singleton()
export class AuditQueryRepository implements IAuditQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(AuditMapper)
    private readonly mapper: AuditMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  async find(spec: AuditSpecification): Promise<IAuditDTO[]> {
    const qb = this.db.select().from(audit).$dynamic()
    const visitor = new AuditFilterVisitor()

    spec.accept(visitor)

    const audits = await qb.where(visitor.cond)

    return audits.map(this.mapper.toDTO)
  }
}
