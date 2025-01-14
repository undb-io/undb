import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import {
  CREATED_BY_TYPE,
  ID_TYPE,
  RecordComositeSpecification,
  RecordDO,
  TableIdVo,
  UPDATED_BY_TYPE,
  enrichRecord,
  injectRecordOutboxService,
  injectTableRepository,
  type Field,
  type IRecordOutboxService,
  type IRecordRepository,
  type ITableRepository,
  type RecordId,
  type TableDo,
} from "@undb/table"
import { chunk } from "es-toolkit/array"
import { sql, type CompiledQuery, type ExpressionBuilder } from "kysely"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
import { RecordQueryHelper } from "./record-query.helper"
import { getRecordDTOFromEntity } from "./record-utils"
import { RecordMapper } from "./record.mapper"
import { RecordMutateVisitor } from "./record.mutate-visitor"

@singleton()
export class RecordRepository implements IRecordRepository {
  constructor(
    @injectRecordOutboxService()
    private readonly outboxService: IRecordOutboxService,
    @inject(RecordMapper)
    public readonly mapper: RecordMapper,
    @injectTableRepository()
    private readonly tableRepo: ITableRepository,
    @inject(RecordQueryHelper)
    private readonly helper: RecordQueryHelper,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
  ) {}

  private async getForeignTables(table: TableDo, fields: Field[]): Promise<Map<string, TableDo>> {
    const map = new Map<string, TableDo>()

    const foriengTableIds = table.schema.getForeignTableIds(fields)
    const foreignTables = await this.tableRepo.findManyByIds([...foriengTableIds].map((id) => new TableIdVo(id)))
    for (const foreignTable of foreignTables) {
      map.set(foreignTable.id.value, foreignTable)
    }

    return map
  }

  async insert(table: TableDo, record: RecordDO): Promise<void> {
    const trx = this.txContext.getAnonymousTransaction()
    const userId = this.context.mustGetCurrentUserId()

    const t = new UnderlyingTable(table)

    const spec = record.toInsertSpec(table)

    const sql: CompiledQuery[] = []

    await trx
      .insertInto(t.name)
      .values((eb) => {
        const visitor = new RecordMutateVisitor(table, record, trx, eb, this.context, this.dbProvider)
        spec.accept(visitor)

        sql.push(...visitor.sql)

        return { ...visitor.data, [CREATED_BY_TYPE]: userId, [UPDATED_BY_TYPE]: userId }
      })
      .executeTakeFirst()
    for (const s of sql) {
      await trx.executeQuery(s)
    }

    const inserted = (await this.findOneById(table, record.id)).expect("Record not found after insert")
    enrichRecord(table, record, inserted)

    await this.outboxService.save(record)
  }

  async #bulkInsert(table: TableDo, records: RecordDO[]): Promise<void> {
    const trx = this.txContext.getAnonymousTransaction()
    const userId = this.context.mustGetCurrentUserId()

    const t = new UnderlyingTable(table)

    const sql: CompiledQuery[] = []

    await trx
      .insertInto(t.name)
      .values((eb) =>
        records.map((record) => {
          const spec = record.toInsertSpec(table)
          const visitor = new RecordMutateVisitor(table, record, trx, eb, this.context, this.dbProvider)
          spec.accept(visitor)

          sql.push(...visitor.sql)

          return { ...visitor.data, [CREATED_BY_TYPE]: userId, [UPDATED_BY_TYPE]: userId }
        }),
      )
      .executeTakeFirst()
    for (const s of sql) {
      await trx.executeQuery(s)
    }

    const inserted = await this.findByIds(
      table,
      records.map((r) => r.id),
    ).then((records) => {
      const map = new Map<string, RecordDO>()
      for (const record of records) {
        map.set(record.id.value, record)
      }
      return map
    })

    for (const record of records) {
      const insertedRecord = inserted.get(record.id.value)
      if (!insertedRecord) {
        continue
      }

      enrichRecord(table, record, insertedRecord)
    }

    await this.outboxService.saveMany(records)
  }

  async bulkInsert(table: TableDo, records: RecordDO[]): Promise<void> {
    const chunked = chunk(records, 500)
    for (const chunk of chunked) {
      await this.#bulkInsert(table, chunk)
    }
  }

  async findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>> {
    const selected = table.getSelectFields()
    const foreignTables = await this.getForeignTables(table, selected)
    const qb = this.helper.createQuery(table, foreignTables, selected, spec)

    const record = await qb.limit(1).executeTakeFirst()
    const dto = record ? getRecordDTOFromEntity(table, record, foreignTables) : undefined
    return dto ? Some(RecordDO.fromJSON(table, dto)) : None
  }

  async find(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<RecordDO[]> {
    const selected = table.getSelectFields()
    const foreignTables = await this.getForeignTables(table, selected)
    const qb = this.helper.createQuery(table, foreignTables, selected, spec)
    const records = await qb.where(this.helper.handleWhere(table, spec)).execute()

    return records.map((record) => {
      const dto = getRecordDTOFromEntity(table, record, foreignTables)
      return RecordDO.fromJSON(table, dto)
    })
  }

  async findOneById(table: TableDo, recordId: RecordId): Promise<Option<RecordDO>> {
    const selected = table.getSelectFields()
    const foreignTables = await this.getForeignTables(table, selected)
    const qb = this.helper.createQuery(table, foreignTables, selected, None)

    const records = await qb.where(`${table.id.value}.${ID_TYPE}`, "=", recordId.value).limit(1).execute()

    if (!records.length) {
      return None
    }

    const dto = getRecordDTOFromEntity(table, records[0], foreignTables)
    return Some(RecordDO.fromJSON(table, dto))
  }

  async findByIds(table: TableDo, ids: RecordId[]): Promise<RecordDO[]> {
    const selected = table.getSelectFields()
    const foreignTables = await this.getForeignTables(table, selected)
    const qb = this.helper.createQuery(table, foreignTables, selected, None)

    const records = await qb
      .where(
        `${table.id.value}.${ID_TYPE}`,
        "in",
        ids.map((id) => id.value),
      )
      .execute()

    return records.map((record) => {
      const dto = getRecordDTOFromEntity(table, record, foreignTables)
      return RecordDO.fromJSON(table, dto)
    })
  }

  async updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void> {
    if (spec.isNone()) return
    const trx = this.txContext.getAnonymousTransaction()

    const userId = this.context.mustGetCurrentUserId()

    const t = new UnderlyingTable(table)
    const sql: CompiledQuery[] = []

    await trx
      .updateTable(t.name)
      .set((eb) => {
        const visitor = new RecordMutateVisitor(table, record, trx, eb, this.context, this.dbProvider)
        spec.unwrap().accept(visitor)
        sql.push(...visitor.sql)
        return { ...visitor.data, [UPDATED_BY_TYPE]: userId }
      })
      .where(`${table.id.value}.${ID_TYPE}`, "=", record.id.value)
      .executeTakeFirst()

    for (const s of sql) {
      await trx.executeQuery(s)
    }

    const updated = (await this.findOneById(table, record.id)).expect("Record not found after update")
    enrichRecord(table, record, updated)

    await this.outboxService.save(record)
  }

  async bulkUpdate(
    table: TableDo,
    spec: Option<RecordComositeSpecification>,
    update: RecordComositeSpecification,
    records: RecordDO[],
  ): Promise<void> {
    const trx = this.txContext.getAnonymousTransaction()
    const userId = this.context.mustGetCurrentUserId()

    const t = new UnderlyingTable(table)
    const queries: CompiledQuery[] = []

    const handleUpdate = () => {
      return (eb: ExpressionBuilder<any, any>) => {
        let data = {}
        if (records.length) {
          for (const record of records) {
            const visitor = new RecordMutateVisitor(table, record, trx, eb, this.context, this.dbProvider)
            update.accept(visitor)
            queries.push(...visitor.sql)
            data = { ...data, ...visitor.data }
          }
        } else {
          const visitor = new RecordMutateVisitor(table, null, trx, eb, this.context, this.dbProvider)
          update.accept(visitor)
          queries.push(...visitor.sql)
          data = visitor.data
        }
        return { ...data, [UPDATED_BY_TYPE]: userId }
      }
    }

    const updated = await trx
      .updateTable(t.name)
      .where((eb) => {
        if (records.length) {
          return eb.eb(
            ID_TYPE,
            "in",
            records.map((r) => r.id.value),
          )
        }

        return eb.eb(sql.raw("1"), "=", sql.raw("1"))
      })
      .set(handleUpdate())
      .execute()

    for (const s of queries) {
      await trx.executeQuery(s)
    }

    if (records.length) {
      const updated = (await this.findOneById(table, records[0].id)).expect("Record not found after update")
      for (const record of records) {
        enrichRecord(table, record, updated)
      }
    }
    await this.outboxService.saveMany(records)
  }

  // @transactional()
  async deleteOneById(table: TableDo, record: RecordDO): Promise<void> {
    const t = new UnderlyingTable(table)

    const trx = this.txContext.getAnonymousTransaction()
    await trx.deleteFrom(t.name).where(ID_TYPE, "=", record.id.value).executeTakeFirst()
    await this.outboxService.save(record)
  }

  async deleteByIds(table: TableDo, records: RecordDO[]): Promise<void> {
    const t = new UnderlyingTable(table)
    const trx = this.txContext.getAnonymousTransaction()
    const ids = records.map((r) => r.id.value)
    await trx.deleteFrom(t.name).where(ID_TYPE, "in", ids).executeTakeFirst()
    await this.outboxService.saveMany(records)
  }
}
