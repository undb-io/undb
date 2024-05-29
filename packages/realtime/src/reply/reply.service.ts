import { inject, singleton } from "@undb/di"
import { injectDb, type Database } from "@undb/persistence"
import { outbox } from "@undb/persistence"
import { PubSubContext } from "../pubsub/pubsub.context"
import { inArray } from "drizzle-orm"

@singleton()
export class ReplyService {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext,
  ) {}

  public async scan() {
    const outboxList = await this.db.select().from(outbox).limit(10)

    for (const item of outboxList) {
      this.pubsub.publish(item.name, JSON.stringify(item))
    }

    if (outboxList.length > 0) {
      await this.db.delete(outbox).where(
        inArray(
          outbox.id,
          outboxList.map((o) => o.id),
        ),
      )
    }
  }
}
