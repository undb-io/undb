import { v4 } from 'uuid'

export interface IEvent<P extends object = object> {
  id: string
  name: string
  payload: P
  timestamp: Date
}

export abstract class BaseEvent<P extends object = object, E extends string = string> implements IEvent<P> {
  timestamp = new Date()
  abstract name: E
  constructor(public readonly payload: P, public readonly id = v4()) {}

  toJSON() {
    return {
      ...this.payload,
      eventId: this.id,
      timestamp: this.timestamp.toISOString(),
    }
  }
}
