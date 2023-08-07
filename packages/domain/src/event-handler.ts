import type { IEvent } from './event.js'

export interface IEventHandler<TEvent extends IEvent, TResult = void> {
  handle(event: TEvent): Promise<TResult> | TResult
}
