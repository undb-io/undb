import { singleton } from "@undb/di"
import type { IRecordOutboxService, RecordDO } from "@undb/table"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { OutboxMapper } from "../outbox.mapper"
import { outbox } from "../tables"

@singleton()
export class RecordOutboxService implements IRecordOutboxService {
  constructor(
    @injectDb()
    private readonly db: Database,
  ) {}

  async save(r: RecordDO): Promise<void> {
    const values = r.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await this.db.insert(outbox).values(values)
    r.removeEvents(r.domainEvents)
  }
  async saveMany(d: RecordDO[]): Promise<void> {
    if (!d.length) return

    const values = d.flatMap((r) => r.domainEvents.map(OutboxMapper.fromEvent))
    await this.db.insert(outbox).values(values)
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
