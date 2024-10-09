import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { ITableOutboxService, TableDo } from "@undb/table"
import { getCurrentTransaction } from "../ctx"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  constructor(
    @injectContext()
    private readonly context: IContext,
  ) {}
  async save(table: TableDo): Promise<void> {
    const trx = getCurrentTransaction()
    const values = table.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context))
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    table.removeEvents(table.domainEvents)
  }

  async saveMany(d: TableDo[]): Promise<void> {
    const trx = getCurrentTransaction()
    const values = d.flatMap((table) => table.domainEvents.map((e) => OutboxMapper.fromEvent(e, this.context)))
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    d.forEach((table) => table.removeEvents(table.domainEvents))
  }
}
