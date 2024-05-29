import { inject, singleton } from "@undb/di"
import { injectDb, type Database } from "@undb/persistence"
import { outbox } from "@undb/persistence"
import { PubSubContext } from "../pubsub/pubsub.context"

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

    for (const outbox of outboxList) {
      this.pubsub.publish(outbox.name, JSON.stringify(outbox))
    }
  }
}
