import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { None, Option, Some } from "@undb/domain"
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
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import type { InsertTable, InsertTableIdMapping } from "../db"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { json } from "../qb.util"
import { UnderlyingTableService } from "../underlying/underlying-table.service"
import { TableFilterVisitor } from "./table.filter-visitor"
import { TableMapper } from "./table.mapper"
import { TableMutationVisitor } from "./table.mutation-visitor"
import { TableReferenceVisitor } from "./table.reference-visitor"

@singleton()
export class TableRepository implements ITableRepository {
  constructor(
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService,
    @injectTableOutboxService()
    private readonly outboxService: ITableOutboxService,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
  ) {}

  get mapper() {
    return new TableMapper()
  }

  async updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void> {
    return this.#updateOneById(table, spec)
  }

  async #updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void> {
    if (spec.isNone()) {
      return
    }

    const trx = this.txContext.getCurrentTransaction()

    const userId = this.context.mustGetCurrentUserId()

    const visitor = new TableMutationVisitor(table, trx, this.dbProvider)
    spec.unwrap().accept(visitor)

    await trx
      .updateTable("undb_table")
      .set({ ...visitor.data, updated_by: userId, updated_at: new Date().toISOString() })
      .where((eb) => eb.eb("id", "=", table.id.value))
      .execute()
    for (const sql of visitor.sql) {
      await trx.executeQuery(sql)
    }
    await this.underlyingTableService.update(table, spec.unwrap())
    await this.outboxService.save(table)
  }

  async insert(table: TableDo): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()
    const userId = this.context.mustGetCurrentUserId()

    const spaceId = table.spaceId ?? this.context.mustGetCurrentSpaceId()

    const rls = table.rls.into(undefined)
    const values: InsertTable = {
      id: table.id.value,
      name: table.name.value,
      base_id: table.baseId,
      created_by: userId,
      space_id: spaceId,
      created_at: new Date().toISOString(),
      schema: json(table.schema.toJSON()),
      views: json(table.views.toJSON()),
      forms: table.forms ? json(table.forms?.toJSON()) : null,
      rls: rls ? json(rls.toJSON()) : null,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }

    await trx.insertInto("undb_table").values(values).execute()

    const viewIds = table.views.views.map((v) => v.id.value)
    const formIds = table.forms?.props.map((v) => v.id) ?? []
    const fieldsIds = table.schema.noneSystemFields.map((f) => f.id.value)
    const mapping: InsertTableIdMapping[] = viewIds
      .concat(formIds)
      .concat(fieldsIds)
      .map((id) => ({ table_id: table.id.value, subject_id: id }))
    await trx
      .insertInto("undb_table_id_mapping")
      .values(mapping)
      .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
      .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
      .execute()

    for (const view of table.views.views) {
      await trx
        .insertInto("undb_table_id_mapping")
        .values({
          table_id: table.id.value,
          subject_id: view.id.value,
        })
        .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
        .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
        .execute()
    }

    for (const form of table.forms?.props ?? []) {
      await trx
        .insertInto("undb_table_id_mapping")
        .values({
          table_id: table.id.value,
          subject_id: form.id,
        })
        .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
        .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
        .execute()
    }

    for (const field of table.schema.fields) {
      if (field.type === "rollup") {
        const referenceField = field.getReferenceField(table)
        const option = field.option.unwrap()
        await trx
          .insertInto("undb_rollup_id_mapping")
          .values({
            field_id: option.rollupFieldId,
            table_id: referenceField.foreignTableId,
            rollup_id: field.id.value,
            rollup_table_id: table.id.value,
          })
          .onConflict((ob) => ob.doNothing())
          .execute()
      } else if (field.type === "reference") {
        await trx
          .insertInto("undb_reference_id_mapping")
          .values({
            field_id: field.id.value,
            table_id: table.id.value,
            symmetric_field_id: field.symmetricFieldId,
            foreign_table_id: field.foreignTableId,
          })
          .onConflict((ob) => ob.doNothing())
          .execute()
      }
    }

    await this.underlyingTableService.create(table)
    await this.outboxService.save(table)
  }

  async insertMany(tables: TableDo[]): Promise<void> {
    for (const table of tables) {
      await this.insert(table)
    }
  }

  async bulkUpdate(updates: { table: TableDo; spec: Option<TableComositeSpecification> }[]): Promise<void> {
    for (const update of updates) {
      await this.#updateOneById(update.table, update.spec)
    }
  }

  async find(spec: Option<TableComositeSpecification>, ignoreSpace?: boolean): Promise<TableDo[]> {
    const tx = this.txContext.getCurrentTransaction()
    const query = tx
      .selectFrom("undb_table")
      .selectAll("undb_table")
      .$if(spec.isSome(), (qb) => new TableReferenceVisitor(qb).call(spec.unwrap()))
      .where((eb) => new TableFilterVisitor(tx, eb, this.context.mustGetCurrentSpaceId(), ignoreSpace).$where(spec))
    const tbs = await query.execute()

    return tbs.map((t) => this.mapper.toDo(t))
  }

  async findOne(spec: Option<TableComositeSpecification>): Promise<Option<TableDo>> {
    const tx = this.txContext.getCurrentTransaction()
    const tb = await tx
      .selectFrom("undb_table")
      .selectAll("undb_table")
      .$if(spec.isSome(), (qb) => new TableReferenceVisitor(qb).call(spec.unwrap()))
      .where((eb) => new TableFilterVisitor(tx, eb, this.context.mustGetCurrentSpaceId()).$where(spec))
      .executeTakeFirst()

    if (!tb) {
      return None
    }

    return Some(this.mapper.toDo(tb))
  }

  async findOneById(id: TableId): Promise<Option<TableDo>> {
    const spec = Some(new TableIdSpecification(id))
    const tx = this.txContext.getCurrentTransaction()
    const tb = await tx
      .selectFrom("undb_table")
      .selectAll("undb_table")
      .$call((qb) => new TableReferenceVisitor(qb).call(spec.unwrap()))
      .where((eb) => new TableFilterVisitor(tx, eb, this.context.mustGetCurrentSpaceId()).$where(spec))
      .executeTakeFirst()

    return tb ? Some(this.mapper.toDo(tb)) : None
  }

  async findManyByIds(ids: TableId[]): Promise<TableDo[]> {
    const spec = Some(new TableIdsSpecification(ids))
    const tx = this.txContext.getCurrentTransaction()
    const tbs = await tx
      .selectFrom("undb_table")
      .selectAll("undb_table")
      .$call((qb) => new TableReferenceVisitor(qb).call(spec.unwrap()))
      .where((eb) => new TableFilterVisitor(tx, eb, this.context.mustGetCurrentSpaceId()).$where(spec))
      .execute()

    return tbs.map((t) => this.mapper.toDo(t))
  }

  async deleteOneById(table: TableDo): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()
    await trx
      .deleteFrom("undb_table_id_mapping")
      .where((eb) => eb.eb("table_id", "=", table.id.value))
      .execute()

    await trx
      .deleteFrom("undb_rollup_id_mapping")
      .where((eb) => eb.eb("table_id", "=", table.id.value).or(eb.eb("rollup_table_id", "=", table.id.value)))
      .execute()

    await trx
      .deleteFrom("undb_reference_id_mapping")
      .where((eb) => eb.or([eb.eb("table_id", "=", table.id.value), eb.eb("foreign_table_id", "=", table.id.value)]))
      .execute()

    await trx
      .deleteFrom("undb_dashboard_table_id_mapping")
      .where((eb) => eb.eb("table_id", "=", table.id.value))
      .execute()

    await trx
      .deleteFrom("undb_attachment_mapping")
      .where((eb) => eb.eb("table_id", "=", table.id.value))
      .execute()

    await trx
      .deleteFrom("undb_webhook")
      .where((eb) => eb.eb("table_id", "=", table.id.value))
      .execute()

    await trx
      .deleteFrom("undb_table")
      .where((eb) => eb.eb("id", "=", table.id.value))
      .execute()

    await this.underlyingTableService.delete(table)
    await this.outboxService.save(table)
  }
}
