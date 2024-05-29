import cron, { Patterns } from "@elysiajs/cron"
import Stream from "@elysiajs/stream"
import { inject, singleton } from "@undb/di"
import { PubSubContext, ReplyService, RxJSPubSub } from "@undb/realtime"
import Elysia from "elysia"

@singleton()
export class RealtimeRoute {
  constructor(
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext,
    @inject(RxJSPubSub)
    rxjsPubSub: RxJSPubSub,
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
      .get("/sse", () => new Stream(this.pubsub.subscribe("record.*")))
  }
}
