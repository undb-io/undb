export interface IEvent<P extends object = object> {
  name: string
  payload: P
  timestamp: Date
}

export abstract class BaseEvent<P extends object = object, E extends string = string> implements IEvent<P> {
  timestamp = new Date()
  abstract name: E
  constructor(public readonly payload: P) {}
}
