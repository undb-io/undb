import {
  injectBaseOutboxService,
  WithBaseId,
  WithBaseSpaceId,
  type Base,
  type IBaseOutboxService,
  type IBaseRepository,
  type IBaseSpecification,
} from "@undb/base"
import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { injectTableRepository, TableBaseIdSpecification, type ITableRepository } from "@undb/table"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { UnderlyingTableService } from "../underlying/underlying-table.service"
import { BaseFilterVisitor } from "./base.filter-visitor"
import { BaseMapper } from "./base.mapper"
import { BaseMutateVisitor } from "./base.mutate-visitor"

@singleton()
export class BaseRepository implements IBaseRepository {
  constructor(
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectBaseOutboxService()
    private readonly outboxService: IBaseOutboxService,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  async find(spec: IBaseSpecification): Promise<Base[]> {
    const tx = this.txContext.getCurrentTransaction()
    const bases = await tx
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return bases.map((base) => this.mapper.toDo(base))
  }
  async findOne(spec: IBaseSpecification): Promise<Option<Base>> {
    const base = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return base ? Some(this.mapper.toDo(base)) : None
  }
  async findOneById(id: string): Promise<Option<Base>> {
    const spaceId = this.context.mustGetCurrentSpaceId()
    const spec = WithBaseId.fromString(id).and(new WithBaseSpaceId(spaceId))

    const base = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return base ? Some(this.mapper.toDo(base)) : None
  }
  async insert(base: Base): Promise<void> {
    const user = this.context.mustGetCurrentUserId()
    const values = this.mapper.toEntity(base)

    await this.txContext
      .getCurrentTransaction()
      .insertInto("undb_base")
      .values({
        ...values,
        created_by: user,
        updated_by: user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute()

    await this.outboxService.save(base)
  }
  async updateOneById(base: Base, spec: IBaseSpecification): Promise<void> {
    const userId = this.context.mustGetCurrentUserId()

    const visitor = new BaseMutateVisitor()
    spec.accept(visitor)

    await this.txContext
      .getCurrentTransaction()
      .updateTable("undb_base")
      .set({ ...visitor.data, updated_by: userId, updated_at: new Date().toISOString() })
      .where((eb) => eb.eb("id", "=", base.id.value))
      .execute()
    await this.outboxService.save(base)
  }

  async deleteOneById(id: string): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()

    const tables = await this.tableRepository.find(Some(new TableBaseIdSpecification(id)))
    const tableIds = tables.map((t) => t.id.value)

    await trx
      .deleteFrom("undb_table_id_mapping")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_rollup_id_mapping")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_reference_id_mapping")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_dashboard_table_id_mapping")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_attachment_mapping")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_webhook")
      .where((eb) => eb.eb("table_id", "in", tableIds))
      .execute()

    await trx
      .deleteFrom("undb_dashboard")
      .where((eb) => eb.eb("base_id", "=", id))
      .execute()

    await trx
      .deleteFrom("undb_table")
      .where((eb) => eb.eb("base_id", "=", id))
      .execute()

    await trx
      .deleteFrom("undb_base")
      .where((eb) => eb.eb("id", "=", id))
      .execute()

    await this.underlyingTableService.deleteTables(tables)
  }
}
