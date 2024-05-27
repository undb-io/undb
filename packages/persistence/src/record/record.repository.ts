import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import {
  ID_TYPE,
  RecordComositeSpecification,
  RecordDO,
  injectRecordOutboxService,
  type IRecordOutboxService,
  type IRecordRepository,
  type RecordId,
  type TableDo,
} from "@undb/table"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
import { injectDbUnitOfWork, transactional } from "../uow"
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
    const t = new UnderlyingTable(table)

    const values = this.mapper.toEntity(record)

    await this.qb.insertInto(t.name).values(values).executeTakeFirst()
    await this.outboxService.save(record)
  }

  async findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>> {
    const t = new UnderlyingTable(table)

    const record = await this.qb.selectFrom(t.name).selectAll().limit(1).executeTakeFirst()
    return record ? Some(RecordDO.fromJSON(table, { id: record.id, values: record })) : None
  }

  async findOneById(table: TableDo, recordId: RecordId): Promise<Option<RecordDO>> {
    const t = new UnderlyingTable(table)
    const records = await this.qb.selectFrom(t.name).selectAll().where(ID_TYPE, "=", recordId.value).limit(1).execute()

    if (!records.length) {
      return None
    }

    const { id, ...values } = records[0] as Record<string, any>
    return Some(RecordDO.fromJSON(table, { id, values }))
  }

  @transactional()
  async updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void> {
    if (spec.isNone()) return

    const t = new UnderlyingTable(table)

    await this.qb
      .updateTable(t.name)
      .set((eb) => {
        const visitor = new RecordMutateVisitor(eb)
        spec.unwrap().accept(visitor)
        return visitor.data
      })
      .where(ID_TYPE, "=", record.id.value)
      .executeTakeFirst()

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
