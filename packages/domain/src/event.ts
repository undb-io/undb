import { v4 } from 'uuid'

export interface IEvent<TPayload extends object = object, TMeta = any> {
  id: string
  name: string
  operatorId: string
  payload: TPayload
  timestamp: Date
  meta: TMeta
}

export abstract class BaseEvent<
  TPayload extends object = object,
  TName extends string = string,
  TMeta extends object | undefined = undefined,
> implements IEvent<TPayload>
{
  timestamp = new Date()
  abstract name: TName
  constructor(
    public readonly payload: TPayload,
    public readonly operatorId: string,
    public readonly meta: TMeta,
    public readonly id = v4(),
  ) {}

  toJSON() {
    return {
      eventId: this.id,
      operatorId: this.operatorId,
      timestamp: this.timestamp.toISOString(),
      payload: this.payload,
      meta: this.meta,
    }
  }
}
