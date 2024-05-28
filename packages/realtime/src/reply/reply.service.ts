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
    private readonly pubsub: PubSubContext<string>,
  ) {}

  public async scan() {
    const outboxList = await this.db.select().from(outbox).limit(1)

    for (const outbox of outboxList) {
      // TODO: outbox type
      this.pubsub.publish(JSON.stringify(outbox))
    }
  }
}
