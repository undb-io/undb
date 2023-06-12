import { JsonObject } from 'type-fest'

export interface IEvent {
  name: string
  payload: JsonObject
}
