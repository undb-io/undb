import { Subject } from "rxjs"
import { type PubSub } from "./pubsub.context"
import { singleton } from "@undb/di"

@singleton()
export class RxJSPubSub<Message> implements PubSub<Message> {
  private subject: Subject<Message>
  // TODO: multiple subscription
  private subscription: any

  constructor() {
    this.subject = new Subject<Message>()
  }

  publish(message: Message): void {
    this.subject.next(message)
  }

  subscribe(callback: (message: Message) => void): void {
    this.subscription = this.subject.subscribe(callback)
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
