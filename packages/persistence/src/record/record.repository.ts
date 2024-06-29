import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import {
  CREATED_BY_TYPE,
  ID_TYPE,
  RecordComositeSpecification,
  RecordDO,
  UPDATED_BY_TYPE,
  injectRecordOutboxService,
  type IRecordOutboxService,
  type IRecordRepository,
  type RecordId,
  type TableDo,
} from "@undb/table"
import type { CompiledQuery } from "kysely"
import { all } from "radash"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
import { injectDbUnitOfWork, transactional } from "../uow"
import { getRecordDTOFromEntity } from "./record-utils"
import { RecordMapper } from "./record.mapper"
import { RecordMutateVisitor } from "./record.mutate-visitor"

@singleton()
export class RecordRepository implements IRecordRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectRecordOutboxService()
    private readonly outboxService: IRecordOutboxService,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @inject(RecordMapper)
    public readonly mapper: RecordMapper,
  ) {}

  @transactional()
  async insert(table: TableDo, record: RecordDO): Promise<void> {
    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)

    const spec = record.toInsertSpec(table)

    const sql: CompiledQuery[] = []

    await this.qb
      .insertInto(t.name)
      .values((eb) => {
        const visitor = new RecordMutateVisitor(table, record, this.qb, eb)
        spec.accept(visitor)

        sql.push(...visitor.sql)

        return { ...visitor.data, [CREATED_BY_TYPE]: userId, [UPDATED_BY_TYPE]: userId }
      })
      .executeTakeFirst()
    await all(sql.map((s) => this.qb.executeQuery(s)))
    await this.outboxService.save(record)
  }

  async buldInsert(table: TableDo, records: RecordDO[]): Promise<void> {
    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)

    const sql: CompiledQuery[] = []

    await this.qb
      .insertInto(t.name)
      .values((eb) =>
        records.map((record) => {
          const spec = record.toInsertSpec(table)
          const visitor = new RecordMutateVisitor(table, record, this.qb, eb)
          spec.accept(visitor)

          sql.push(...visitor.sql)

          return { ...visitor.data, [CREATED_BY_TYPE]: userId, [UPDATED_BY_TYPE]: userId }
        }),
      )
      .executeTakeFirst()
    await all(sql.map((s) => this.qb.executeQuery(s)))
    await this.outboxService.saveMany(records)
  }

  async findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>> {
    const t = new UnderlyingTable(table)

    const record = await this.qb.selectFrom(t.name).selectAll().limit(1).executeTakeFirst()
    const dto = record ? getRecordDTOFromEntity(table, record) : undefined
    return dto ? Some(RecordDO.fromJSON(table, dto)) : None
  }

  async findOneById(table: TableDo, recordId: RecordId): Promise<Option<RecordDO>> {
    const t = new UnderlyingTable(table)
    const records = await this.qb.selectFrom(t.name).selectAll().where(ID_TYPE, "=", recordId.value).limit(1).execute()

    if (!records.length) {
      return None
    }

    const dto = getRecordDTOFromEntity(table, records[0])
    return Some(RecordDO.fromJSON(table, dto))
  }

  @transactional()
  async updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void> {
    if (spec.isNone()) return

    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)
    const sql: CompiledQuery[] = []

    await this.qb
      .updateTable(t.name)
      .set((eb) => {
        const visitor = new RecordMutateVisitor(table, record, this.qb, eb)
        spec.unwrap().accept(visitor)
        sql.push(...visitor.sql)
        return { ...visitor.data, [UPDATED_BY_TYPE]: userId }
      })
      .where(ID_TYPE, "=", record.id.value)
      .executeTakeFirst()

    await all(sql.map((sql) => this.qb.executeQuery(sql)))

    await this.outboxService.save(record)
  }

  @transactional()
  async deleteOneById(table: TableDo, record: RecordDO): Promise<void> {
    const t = new UnderlyingTable(table)
    // TODO: use deleted at
    await this.qb.deleteFrom(t.name).where(ID_TYPE, "=", record.id.value).executeTakeFirst()
    await this.outboxService.save(record)
  }
}
