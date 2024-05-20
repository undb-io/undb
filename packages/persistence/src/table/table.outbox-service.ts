import { singleton } from "@undb/di"
import type { ITableOutboxService, TableDo } from "@undb/table"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { OutboxMapper } from "../outbox.mapper"
import { outbox } from "../tables"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  constructor(
    @injectDb()
    private readonly db: Database,
  ) {}

  async save(table: TableDo): Promise<void> {
    const values = table.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await this.db.insert(outbox).values(values)
    table.removeEvents(table.domainEvents)
  }
}
