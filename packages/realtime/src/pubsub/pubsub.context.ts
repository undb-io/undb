import { singleton } from "@undb/di"
import type { Topic } from "../reply/topic"

export interface Message<T> {
  topic: Topic
  message: T
}

export interface PubSub<T> {
  publish(topic: Topic, message: T): void
  subscribe(topic: Topic): AsyncIterable<T>
}

@singleton()
export class PubSubContext<T> {
  private pubSub!: PubSub<T>

  setPubSub(pubSub: PubSub<T>): void {
    this.pubSub = pubSub
  }

  publish(topic: Topic, message: T): void {
    this.pubSub.publish(topic, message)
  }

  subscribe(topic: Topic): AsyncIterable<T> {
    return this.pubSub.subscribe(topic)
  }
}
