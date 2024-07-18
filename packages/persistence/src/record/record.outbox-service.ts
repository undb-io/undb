import { singleton } from "@undb/di"
import type { IRecordOutboxService, RecordDO } from "@undb/table"
import { getCurrentTransaction } from "../ctx"
import { OutboxMapper } from "../outbox.mapper"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class RecordOutboxService implements IRecordOutboxService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async save(r: RecordDO): Promise<void> {
    const trx = getCurrentTransaction()
    const values = r.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }
  async saveMany(d: RecordDO[]): Promise<void> {
    if (!d.length) return

    const trx = getCurrentTransaction()
    const values = d.flatMap((r) => r.domainEvents.map(OutboxMapper.fromEvent))
    await trx.insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
