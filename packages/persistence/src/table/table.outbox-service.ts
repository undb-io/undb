import { singleton } from "@undb/di"
import type { ITableEvents, ITableOutboxService } from "@undb/table"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { outbox } from "../tables"

@singleton()
export class TableOutboxService implements ITableOutboxService {
  constructor(
    @injectDb()
    private readonly db: Database,
  ) {}

  async save(events: ITableEvents[]): Promise<void> {
    await this.db.insert(outbox).values(
      events.map((e) => ({
        id: e.id,
        payload: e.payload,
        meta: e.meta,
        name: e.name,
        // TODO: real user
        operatorId: e.operatorId ?? "123",
        timestamp: e.timestamp.toISOString(),
      })),
    )
  }
}
