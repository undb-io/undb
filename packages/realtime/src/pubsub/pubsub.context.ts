import { singleton } from "@undb/di"

export interface Message {
  topic: string
  message: string
}

export interface PubSub {
  publish(topic: string, message: string): void
  subscribe(topic: string): AsyncIterable<string>
}

@singleton()
export class PubSubContext {
  private pubSub!: PubSub

  setPubSub(pubSub: PubSub): void {
    this.pubSub = pubSub
  }

  publish(topic: string, message: string): void {
    this.pubSub.publish(topic, message)
  }

  subscribe(topic: string): AsyncIterable<string> {
    return this.pubSub.subscribe(topic)
  }
}
