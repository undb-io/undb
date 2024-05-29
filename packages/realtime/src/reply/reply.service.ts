import { inject, singleton } from "@undb/di"
import { injectDb, type Database } from "@undb/persistence"
import { outbox } from "@undb/persistence"
import { PubSubContext } from "../pubsub/pubsub.context"
import { inArray } from "drizzle-orm"
import { ReplyEventFactory } from "./reply-event.factory"
import type { BaseEvent } from "@undb/domain"
import { getTopic } from "./topic"

@singleton()
export class ReplyService {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext<BaseEvent>,
  ) {}

  public async scan() {
    const outboxList = await this.db.select().from(outbox).limit(10)

    for (const item of outboxList) {
      const event = ReplyEventFactory.from(item)
      if (event.isNone()) continue

      const evt = event.unwrap()

      const topic = getTopic(evt)
      if (topic.isNone()) continue

      this.pubsub.publish(topic.unwrap(), evt)
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
