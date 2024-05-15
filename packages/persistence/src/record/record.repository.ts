import { inject, singleton } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import {
  injectRecordOutboxService,
  type IRecordOutboxService,
  type IRecordRepository,
  type RecordDO,
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
}
