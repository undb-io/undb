import type { AuditSpecification, IAuditDTO, IAuditQueryRepository } from "@undb/audit"
import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { AuditFilterVisitor } from "./audit.filter-visitor"
import { AuditMapper } from "./audit.mapper"

@singleton()
export class AuditQueryRepository implements IAuditQueryRepository {
  constructor(
    @inject(AuditMapper)
    private readonly mapper: AuditMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async find(spec: AuditSpecification): Promise<IAuditDTO[]> {
    const audits = await this.qb
      .selectFrom("undb_audit")
      .selectAll()
      .where((eb) => {
        const visitor = new AuditFilterVisitor(eb, this.context.mustGetCurrentSpaceId())
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return audits.map((a) => this.mapper.toDTO(a))
  }
}
