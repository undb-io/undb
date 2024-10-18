import type { BaseEvent } from "./event.js"

export interface IEventBus<TEvent extends BaseEvent = BaseEvent> {
  publish(event: TEvent): Promise<void>
  publishMany(events: TEvent[]): Promise<void>
}
