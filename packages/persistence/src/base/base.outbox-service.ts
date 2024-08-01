import type { Base, IBaseOutboxService } from "@undb/base"
import { singleton } from "@undb/di"
import { OutboxMapper } from "../outbox.mapper"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class BaseOutboxService implements IBaseOutboxService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async save(r: Base): Promise<void> {
    const values = r.domainEvents.map(OutboxMapper.fromEvent)
    if (!values.length) return
    await this.qb.insertInto("undb_outbox").values(values).execute()
    r.removeEvents(r.domainEvents)
  }

  async saveMany(d: Base[]): Promise<void> {
    const values = d.flatMap((r) => r.domainEvents.map(OutboxMapper.fromEvent))
    if (!values.length) return

    await this.qb.insertInto("undb_outbox").values(values).execute()
    for (const r of d) {
      r.removeEvents(r.domainEvents)
    }
  }
}
