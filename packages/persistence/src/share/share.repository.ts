import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { WithShareId, type IShareRepository, type Share, type ShareSpecification } from "@undb/share"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { ShareFilterVisitor } from "./share.filter-visitor"
import { ShareMapper } from "./share.mapper"

@singleton()
export class ShareRepository implements IShareRepository {
  constructor(
    @inject(ShareMapper)
    private readonly mapper: ShareMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  insert(share: Share): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async updateOneById(share: Share, spec: ShareSpecification): Promise<void> {
    const entity = this.mapper.toEntity(share)

    await (getCurrentTransaction() ?? this.qb)
      .insertInto("undb_share")
      .values(entity)
      .onConflict((ob) => ob.columns(["target_id", "target_type"]).doUpdateSet({ enabled: share.enabled }))
      .execute()
  }
  async findOneById(id: string): Promise<Option<Share>> {
    const spec = WithShareId.fromString(id)

    const share = await (getCurrentTransaction() ?? this.qb)
      .selectFrom("undb_share")
      .selectAll()
      .where((eb) => {
        const visitor = new ShareFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    if (!share) {
      return None
    }

    return Some(this.mapper.toDo(share))
  }
  async findOne(spec: ShareSpecification): Promise<Option<Share>> {
    const share = await (getCurrentTransaction() ?? this.qb)
      .selectFrom("undb_share")
      .selectAll()
      .where((eb) => {
        const visitor = new ShareFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    if (!share) {
      return None
    }

    return Some(this.mapper.toDo(share))
  }
  find(spec: ShareSpecification): Promise<Share[]> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
