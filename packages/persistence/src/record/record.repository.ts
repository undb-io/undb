import { singleton } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import { createLogger } from "@undb/logger"
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

@singleton()
export class RecordRepository implements IRecordRepository {
  private readonly logger = createLogger(RecordRepository.name)

  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectRecordOutboxService()
    private readonly outboxService: IRecordOutboxService,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  @transactional()
  async insert(table: TableDo, record: RecordDO): Promise<void> {
    const t = new UnderlyingTable(table)

    const values = record.insertValues()

    this.logger.debug({ values }, "Inserting record")

    await this.qb.insertInto(t.name).values(values).executeTakeFirst()
    await this.outboxService.save(record)
  }
}
