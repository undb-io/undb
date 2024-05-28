import { singleton } from "@undb/di"

export interface PubSub<Message> {
  publish(message: Message): void
  subscribe(callback: (message: Message) => void): void
  unsubscribe(): void
}

@singleton()
export class PubSubContext<Message> {
  private pubSub!: PubSub<Message>

  setPubSub(pubSub: PubSub<Message>): void {
    this.pubSub = pubSub
  }

  publish(message: Message): void {
    this.pubSub.publish(message)
  }

  subscribe(callback: (message: Message) => void): void {
    this.pubSub.subscribe(callback)
  }

  unsubscribe(): void {
    this.pubSub.unsubscribe()
  }
}
