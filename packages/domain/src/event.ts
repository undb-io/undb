export interface IEvent<P extends object = object> {
  name: string
  payload: P
  timestamp: Date
}

export abstract class BaseEvent<P extends object = object> implements IEvent<P> {
  timestamp = new Date()
  abstract name: string
  constructor(public readonly payload: P) {}
}
