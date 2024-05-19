import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import {
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

  async findOneById(table: TableDo, recordId: RecordId): Promise<Option<RecordDO>> {
    const t = new UnderlyingTable(table)
    const records = await this.qb.selectFrom(t.name).where("id", "=", recordId).limit(1).execute()

    if (!records.length) {
      return None
    }

    const { id, ...values } = records[0] as Record<string, any>
    return Some(RecordDO.fromJSON(table, { id, values }))
  }

  async updateOneById(table: TableDo, id: RecordId, spec: Option<RecordComositeSpecification>): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
