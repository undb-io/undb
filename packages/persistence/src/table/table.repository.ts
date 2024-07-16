import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type IUnitOfWork } from "@undb/domain"
import {
  TableComositeSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  injectTableOutboxService,
  type ITableOutboxService,
  type ITableRepository,
  type TableDo,
  type TableId,
} from "@undb/table"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { tableIdMapping, tables } from "../tables"
import { UnderlyingTableService } from "../underlying/underlying-table.service"
import { injectDbUnitOfWork } from "../uow"
import { TableDbQuerySpecHandler } from "./table-db.query-spec-handler"
import { TableMapper } from "./table.mapper"
import { TableMutationVisitor } from "./table.mutation-visitor"

@singleton()
export class TableRepository implements ITableRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService,
    @injectTableOutboxService()
    private readonly outboxService: ITableOutboxService,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  get mapper() {
    return new TableMapper()
  }

  // @transactional()
  async updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void> {
    return this.#updateOneById(table, spec)
  }

  async #updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void> {
    if (spec.isNone()) {
      return
    }

    const ctx = executionContext.getStore()
    const userId = ctx!.user!.userId!

    const visitor = new TableMutationVisitor(table, this.db)
    spec.unwrap().accept(visitor)

    await this.db
      .update(tables)
      .set({ ...visitor.updates, updatedBy: userId })
      .where(eq(tables.id, table.id.value))
    await visitor.execute()
    await this.underlyingTableService.update(table, spec.unwrap())
    await this.outboxService.save(table)
  }

  // @transactional()
  async insert(table: TableDo): Promise<void> {
    const ctx = executionContext.getStore()
    const userId = ctx!.user!.userId!

    const values = this.mapper.toEntity(table)

    await this.db.insert(tables).values({ ...values, createdBy: userId, updatedBy: userId })

    const viewIds = table.views.views.map((v) => v.id.value)
    const formIds = table.forms?.props.map((v) => v.id) ?? []
    const fieldsIds = table.schema.noneSystemFields.map((f) => f.id.value)
    const mapping = viewIds
      .concat(formIds)
      .concat(fieldsIds)
      .map((id) => ({ tableId: table.id.value, subjectId: id }))
    await this.db.insert(tableIdMapping).values(mapping)

    await this.underlyingTableService.create(table)
    await this.outboxService.save(table)
  }

  // @transactional()
  async bulkUpdate(updates: { table: TableDo; spec: Option<TableComositeSpecification> }[]): Promise<void> {
    for (const update of updates) {
      await this.#updateOneById(update.table, update.spec)
    }
  }

  async find(spec: Option<TableComositeSpecification>): Promise<TableDo[]> {
    const sb = this.db.select({ table: tables }).from(tables).$dynamic()

    const tb = await new TableDbQuerySpecHandler(this.db, sb).handle(spec)

    return tb.map((t) => this.mapper.toDo(t.table))
  }

  async findOneById(id: TableId): Promise<Option<TableDo>> {
    const sb = this.db.select({ table: tables }).from(tables).$dynamic()

    const spec = Some(new TableIdSpecification(id))
    const tb = await new TableDbQuerySpecHandler(this.db, sb).handle(spec).limit(1)

    return tb.length ? Some(this.mapper.toDo(tb[0].table)) : None
  }

  async findManyByIds(ids: TableId[]): Promise<TableDo[]> {
    const sb = this.db.select({ table: tables }).from(tables).$dynamic()

    const spec = Some(new TableIdsSpecification(ids))
    const tb = await new TableDbQuerySpecHandler(this.db, sb).handle(spec)

    return tb.map((t) => this.mapper.toDo(t.table))
  }
}
