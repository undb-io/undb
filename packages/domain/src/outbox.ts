import type { BaseEvent } from "./event"

export interface IOutboxService<E extends BaseEvent> {
  save(events: E[]): Promise<void>
}
