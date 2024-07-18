import { singleton } from "@undb/di"
import type { ITableOutboxService, TableDo } from "@undb/table"
import { OutboxMapper } from "../outbox.mapper"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async save(table: TableDo): Promise<void> {
    const values = table.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await this.qb.insertInto("undb_outbox").values(values).execute()
    table.removeEvents(table.domainEvents)
  }

  async saveMany(d: TableDo[]): Promise<void> {
    const values = d.flatMap((table) => table.domainEvents.map(OutboxMapper.fromEvent))
    if (!values.length) return
    await this.qb.insertInto("undb_outbox").values(values).execute()
    d.forEach((table) => table.removeEvents(table.domainEvents))
  }
}
