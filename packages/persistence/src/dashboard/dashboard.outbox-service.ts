import { injectContext, type IContext } from "@undb/context"
import type { Dashboard, IDashboardOutboxService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class DashboardOutboxService implements IDashboardOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}
  async save(r: Dashboard): Promise<void> {
    const values = r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return
    await this.txContext.getCurrentTransaction().insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }

  async saveMany(d: Dashboard[]): Promise<void> {
    const values = d.flatMap((r) => r.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    if (!values.length) return

    await this.txContext.getCurrentTransaction().insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
