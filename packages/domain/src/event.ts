import { v4 } from 'uuid'

export interface IEvent<P extends object = object> {
  id: string
  name: string
  operatorId: string
  payload: P
  timestamp: Date
}

export abstract class BaseEvent<P extends object = object, E extends string = string> implements IEvent<P> {
  timestamp = new Date()
  abstract name: E
  constructor(public readonly payload: P, public readonly operatorId: string, public readonly id = v4()) {}

  toJSON() {
    return {
      eventId: this.id,
      operatorId: this.operatorId,
      timestamp: this.timestamp.toISOString(),
      payload: this.payload,
    }
  }
}
