import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { IRecordOutboxService, RecordDO } from "@undb/table"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class RecordOutboxService implements IRecordOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  async save(r: RecordDO): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()
    const values = r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }
  async saveMany(d: RecordDO[]): Promise<void> {
    if (!d.length) return

    const trx = this.txContext.getCurrentTransaction()
    const values = d.flatMap((r) => r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    await trx.insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
