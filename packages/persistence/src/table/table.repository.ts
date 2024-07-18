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
import type { InsertTableIdMapping } from "../db"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTableService } from "../underlying/underlying-table.service"
import { injectDbUnitOfWork } from "../uow"
import { TableDbQuerySpecHandler2 } from "./table-db.query-spec-handler"
import { TableMapper } from "./table.mapper"
import { TableMutationVisitor2 } from "./table.mutation-visitor"

@singleton()
export class TableRepository implements ITableRepository {
  constructor(
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService,
    @injectTableOutboxService()
    private readonly outboxService: ITableOutboxService,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
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

    const visitor = new TableMutationVisitor2(table, this.qb)
    spec.unwrap().accept(visitor)

    await this.qb
      .updateTable("undb_table")
      .set({ ...visitor.data, updated_by: userId })
      .where((eb) => eb.eb("id", "=", table.id.value))
      .execute()
    await this.underlyingTableService.update(table, spec.unwrap())
    await this.outboxService.save(table)
  }

  // @transactional()
  async insert(table: TableDo): Promise<void> {
    const ctx = executionContext.getStore()
    const userId = ctx!.user!.userId!

    const values = this.mapper.toEntity(table)

    await this.qb
      .insertInto("undb_table")
      .values({
        ...values,
        created_by: userId,
        updated_by: userId,
      })
      .execute()

    const viewIds = table.views.views.map((v) => v.id.value)
    const formIds = table.forms?.props.map((v) => v.id) ?? []
    const fieldsIds = table.schema.noneSystemFields.map((f) => f.id.value)
    const mapping: InsertTableIdMapping[] = viewIds
      .concat(formIds)
      .concat(fieldsIds)
      .map((id) => ({ table_id: table.id.value, subject_id: id }))
    await this.qb.insertInto("undb_table_id_mapping").values(mapping).execute()

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
    const tbs = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(spec))
      .execute()

    return tbs.map((t) => this.mapper.toDo(t))
  }

  async findOneById(id: TableId): Promise<Option<TableDo>> {
    const spec = Some(new TableIdSpecification(id))
    const tb = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(spec))
      .executeTakeFirst()

    return tb ? Some(this.mapper.toDo(tb)) : None
  }

  async findManyByIds(ids: TableId[]): Promise<TableDo[]> {
    const spec = Some(new TableIdsSpecification(ids))
    const tbs = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(spec))
      .execute()

    return tbs.map((t) => this.mapper.toDo(t))
  }
}
