import type { BaseEvent, IEventPublisher } from "@undb/domain"
import { Subject } from "rxjs"

export class DefaultEventPubSub<E extends BaseEvent> implements IEventPublisher<E> {
  constructor(public subject$: Subject<E>) {}

  async publish(event: E): Promise<void> {
    this.subject$.next(event)
  }

  async publishMany(events: E[]): Promise<void> {
    events.forEach((event) => this.subject$.next(event))
  }
}
