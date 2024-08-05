import { v4 } from "uuid"

export interface IEvent<TPayload extends object = object, TMeta = any> {
  id: string
  name: string
  operatorId?: string
  payload: TPayload
  timestamp: Date
  meta: TMeta
  spaceId: string
}

export interface IEventJSON<TPayload extends object = object, TMeta = any> {
  id: string
  name: string
  operatorId?: string
  spaceId: string
  payload: TPayload
  timestamp: string
  meta: TMeta
}

export abstract class BaseEvent<TPayload extends object = object, TName extends string = string, TMeta = any>
  implements IEvent<TPayload>
{
  abstract name: TName
  #operatorId?: string | undefined

  public get operatorId() {
    return this.#operatorId
  }

  public set operatorId(operatorId: string | undefined) {
    this.#operatorId = operatorId
  }

  constructor(
    public readonly payload: TPayload,
    public readonly meta: TMeta,
    public readonly spaceId: string,
    public readonly id = v4(),
    public readonly timestamp = new Date(),
  ) {}

  toJSON(): IEventJSON<TPayload, TMeta> {
    return {
      id: this.id,
      name: this.name,
      operatorId: this.operatorId,
      spaceId: this.spaceId,
      timestamp: this.timestamp,
      payload: this.payload,
      meta: this.meta,
    }
  }
}
