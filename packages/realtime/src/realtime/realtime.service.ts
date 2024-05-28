import { inject, singleton } from "@undb/di"
import { PubSubContext } from "../pubsub/pubsub.context"

@singleton()
export class RealtimeService {
  constructor(
    @inject(PubSubContext)
    private readonly pubsub: PubSubContext<string>,
  ) {}

  subscribe() {
    this.pubsub.subscribe((message) => {
      console.log(message)
    })
  }
}
