import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { WithShareId, type IShareRepository, type Share, type ShareSpecification } from "@undb/share"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { ShareFilterVisitor } from "./share.filter-visitor"
import { ShareMapper } from "./share.mapper"

@singleton()
export class ShareRepository implements IShareRepository {
  constructor(
    @inject(ShareMapper)
    private readonly mapper: ShareMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
  ) {}
  insert(share: Share): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async updateOneById(share: Share, spec: ShareSpecification): Promise<void> {
    const entity = this.mapper.toEntity(share)

    await this.txContext
      .getCurrentTransaction()
      .insertInto("undb_share")
      .values(entity)
      .$if(this.dbProvider.isMysql(), (eb) => eb.onDuplicateKeyUpdate({ enabled: share.enabled }))
      .$if(!this.dbProvider.isMysql(), (eb) =>
        eb.onConflict((ob) => ob.columns(["target_id", "target_type"]).doUpdateSet({ enabled: share.enabled })),
      )
      .execute()
  }
  async findOneById(id: string): Promise<Option<Share>> {
    const spec = WithShareId.fromString(id)

    const share = await this.txContext
      .getCurrentTransaction()
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
    const share = await this.txContext
      .getCurrentTransaction()
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
