import { Subject, filter, map, type Observable } from "rxjs"
import { type Message, type PubSub } from "./pubsub.context"
import { singleton } from "@undb/di"
import { Glob } from "bun"

@singleton()
export class RxJSPubSub implements PubSub {
  private subject: Subject<Message>

  constructor() {
    this.subject = new Subject<Message>()
  }

  publish(topic: string, message: string): void {
    this.subject.next({ topic, message })
  }

  subscribe(topic: string): AsyncIterable<string> {
    const observable = this.subject.asObservable().pipe(
      filter((msg: Message) => this.matchTopic(topic, msg)),
      map((msg: Message) => msg.message),
    )

    return this.toAsyncIterable(observable)
  }

  private matchTopic(topic: string, msg: Message) {
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
