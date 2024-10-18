import type { BaseEvent } from "./event"

export interface IEventPublisher<TEvent extends BaseEvent = BaseEvent> {
  publish(event: TEvent): Promise<void>
  publishMany(events: TEvent[]): Promise<void>
}
