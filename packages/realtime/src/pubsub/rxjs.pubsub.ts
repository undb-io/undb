import { Subject, filter, tap, map, type Observable } from "rxjs"
import { type Message, type PubSub } from "./pubsub.context"
import { singleton } from "@undb/di"
import { Glob } from "bun"
import type { Topic } from "../reply/topic"

@singleton()
export class RxJSPubSub<T> implements PubSub<T> {
  private subject: Subject<Message<T>>

  constructor() {
    this.subject = new Subject<Message<T>>()
  }

  publish(topic: Topic, message: T): void {
    this.subject.next({ topic, message })
  }

  subscribe(topic: Topic): AsyncIterable<T> {
    const observable = this.subject.asObservable().pipe(
      filter((msg: Message<T>) => this.matchTopic(topic, msg)),
      map((msg: Message<T>) => msg.message),
    )

    return this.toAsyncIterable(observable)
  }

  private matchTopic(topic: string, msg: Message<T>) {
    return topic === "*" || new Glob(topic).match(msg.topic)
  }

  private toAsyncIterable<T>(observable: Observable<T>): AsyncIterable<T> {
    const queue: T[] = []
    const waiters: ((value: IteratorResult<T>) => void)[] = []
    let completed = false

    const subscription = observable.subscribe({
      next(value) {
        if (waiters.length > 0) {
          const waiter = waiters.shift()
          if (waiter) {
            waiter({ value, done: false })
          }
        } else {
          queue.push(value)
        }
      },
      error(err) {
        while (waiters.length > 0) {
          const waiter = waiters.shift()
          if (waiter) {
            waiter({ value: undefined as unknown as T, done: true })
          }
        }
      },
      complete() {
        completed = true
        while (waiters.length > 0) {
          const waiter = waiters.shift()
          if (waiter) {
            waiter({ value: undefined, done: true })
          }
        }
      },
    })

    return {
      [Symbol.asyncIterator]() {
        return {
          next() {
            if (queue.length > 0) {
              return Promise.resolve({ value: queue.shift()!, done: false })
            } else if (completed) {
              return Promise.resolve({ value: undefined, done: true })
            } else {
              return new Promise<IteratorResult<T>>((resolve) => {
                waiters.push(resolve)
              })
            }
          },
          return() {
            while (waiters.length > 0) {
              const waiter = waiters.shift()
              if (waiter) {
                waiter({ value: undefined, done: true })
              }
            }
            subscription.unsubscribe()
            return Promise.resolve({ value: undefined, done: true })
          },
          throw(error) {
            while (waiters.length > 0) {
              const waiter = waiters.shift()
              if (waiter) {
                waiter({ value: undefined, done: true })
              }
            }
            return Promise.reject(error)
          },
        }
      },
    }
  }
}
