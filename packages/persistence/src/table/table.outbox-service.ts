import { injectContext, type IContext } from "@undb/context"
import { EventBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { IEventBus } from "@undb/domain"
import type { ITableOutboxService, TableDo } from "@undb/table"
import { getCurrentTransaction } from "../ctx"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
    @inject(EventBus)
    private readonly eventBus: IEventBus,
  ) {}
  async save(table: TableDo): Promise<void> {
    const trx = getCurrentTransaction()
    const values = table.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return

    await trx.insertInto("undb_outbox").values(values).execute()
    this.eventBus.publishMany(table.domainEvents)

    table.removeEvents(table.domainEvents)
  }

  async saveMany(d: TableDo[]): Promise<void> {
    const trx = getCurrentTransaction()
    const values = d.flatMap((table) => table.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    if (!values.length) return

    await trx.insertInto("undb_outbox").values(values).execute()
    this.eventBus.publishMany(d.flatMap((table) => table.domainEvents))

    d.forEach((table) => table.removeEvents(table.domainEvents))
  }
}
