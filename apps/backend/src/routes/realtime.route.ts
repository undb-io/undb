import cron, { Patterns } from "@elysiajs/cron"
import Stream from "@elysiajs/stream"
import { inject, singleton } from "@undb/di"
import { BaseEvent } from "@undb/domain"
import { PubSubContext, ReplyService, RxJSPubSub } from "@undb/realtime"
import Elysia, { t } from "elysia"

@singleton()
export class RealtimeRoute {
  constructor(
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext<BaseEvent>,
    @inject(RxJSPubSub)
    rxjsPubSub: RxJSPubSub<BaseEvent>,
    @inject(ReplyService)
    private readonly reply: ReplyService,
  ) {
    pubsub.setPubSub(rxjsPubSub)
  }

  create() {
    return new Elysia()
      .use(
        cron({
          name: "realtime",
          pattern: Patterns.everySecond(),
          run: async () => {
            await this.reply.scan()
          },
        }),
      )
      .get(
        "/api/tables/:tableId/subscription",
        (ctx) => {
          const tableId = ctx.params.tableId
          return new Stream(this.pubsub.subscribe(`tenant.${tableId}.record.*`))
        },
        {
          params: t.Object({ tableId: t.String() }),
        },
      )
  }
}
