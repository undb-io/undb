import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { IRecordOutboxService, RecordDO } from "@undb/table"
import { getCurrentTransaction } from "../ctx"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class RecordOutboxService implements IRecordOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
  ) {}

  async save(r: RecordDO): Promise<void> {
    const trx = getCurrentTransaction()
    const values = r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }
  async saveMany(d: RecordDO[]): Promise<void> {
    if (!d.length) return

    const trx = getCurrentTransaction()
    const values = d.flatMap((r) => r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    await trx.insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
