import { IEvent } from './event.js'

export interface IEventHandler<TEvent extends IEvent> {
  handle(event: TEvent): Promise<void> | void
}
