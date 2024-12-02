import { inject, singleton } from "@undb/di"
import type { BaseEvent } from "@undb/domain"
import { env } from "@undb/env"
import type { IQueryBuilder } from "@undb/persistence/server"
import { injectQueryBuilder } from "@undb/persistence/server"
import { PubSubContext } from "../pubsub/pubsub.context"
import { ReplyEventFactory } from "./reply-event.factory"
import { getTopic } from "./topic"

@singleton()
export class ReplyService {
  constructor(
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext<BaseEvent>,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  public async scan() {
    const outboxList = await this.qb
      .selectFrom("undb_outbox")
      .selectAll()
      .limit(env.UNDB_OUTBOX_SCAN_BATCH_SIZE)
      .execute()
    for (const item of outboxList) {
      const event = ReplyEventFactory.from(item)
      if (event.isNone()) continue

      const evt = event.unwrap()

      const topic = getTopic(evt)
      if (topic.isNone()) continue

      this.pubsub.publish(topic.unwrap(), evt)
    }

    if (outboxList.length > 0) {
      await this.qb
        .deleteFrom("undb_outbox")
        .where((eb) =>
          eb.eb(
            "id",
            "in",
            outboxList.map((o) => o.id),
          ),
        )
        .execute()
    }
  }
}
