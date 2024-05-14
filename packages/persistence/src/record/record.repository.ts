import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { IRecordRepository, RecordDO, TableDo } from "@undb/table"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"

@singleton()
export class RecordRepository implements IRecordRepository {
  private readonly logger = createLogger(RecordRepository.name)

  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async insert(table: TableDo, record: RecordDO): Promise<void> {
    const t = new UnderlyingTable(table)

    const values = record.insertValues()

    this.logger.debug({ values }, "Inserting record")

    await this.qb.insertInto(t.name).values(values).executeTakeFirst()
  }
}
