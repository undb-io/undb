import type { Base, IBaseOutboxService } from "@undb/base"
import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class BaseOutboxService implements IBaseOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}
  async save(r: Base): Promise<void> {
    const values = r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return
    await this.txContext.getCurrentTransaction().insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }

  async saveMany(d: Base[]): Promise<void> {
    const values = d.flatMap((r) => r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    if (!values.length) return

    await this.txContext.getCurrentTransaction().insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
