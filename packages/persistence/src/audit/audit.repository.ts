import type { Audit, AuditSpecification, IAuditRepository } from "@undb/audit"
import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { AuditMapper } from "./audit.mapper"

@singleton()
export class AuditRepository implements IAuditRepository {
  constructor(
    @inject(AuditMapper)
    private readonly mapper: AuditMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: IContext,
  ) {}
  findOne(spec: AuditSpecification): Promise<Option<Audit>> {
    throw new Error("Method not implemented.")
  }
  async insert(audit: Audit): Promise<void> {
    const user = this.context.getCurrentUserId()
    const values = this.mapper.toEntity(audit)

    await this.qb
      .insertInto("undb_audit")
      .values({
        ...values,
        space_id: this.context.mustGetCurrentSpaceId(),
        operator_id: user,
      })
      .execute()
  }
  updateOneById(id: string, spec: AuditSpecification): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
