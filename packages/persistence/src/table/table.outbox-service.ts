import { singleton } from "@undb/di"
import type { ITableOutboxService, TableDo } from "@undb/table"
import { getCurrentTransaction } from "../ctx"
import { OutboxMapper } from "../outbox.mapper"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  async save(table: TableDo): Promise<void> {
    const trx = getCurrentTransaction()
    const values = table.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    table.removeEvents(table.domainEvents)
  }

  async saveMany(d: TableDo[]): Promise<void> {
    const trx = getCurrentTransaction()
    const values = d.flatMap((table) => table.domainEvents.map(OutboxMapper.fromEvent))
    if (!values.length) return
    await trx.insertInto("undb_outbox").values(values).execute()
    d.forEach((table) => table.removeEvents(table.domainEvents))
  }
}
