import type { IEventJSON } from '@undb/domain'
import { match } from 'ts-pattern'
import { EVT_INVITATION_INVITED, InvitedEvent } from './invited.event'

export class EventFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static create(id: string, operatorId: string, name: string, payload: any, meta: any, timestamp: Date) {
    return match(name)
      .with(EVT_INVITATION_INVITED, () => new InvitedEvent(payload, operatorId, meta, id, timestamp))
      .otherwise(() => null)
  }

  static fromJSON(json: IEventJSON) {
    return this.create(json.id, json.operatorId, json.name, json.payload, json.meta, new Date(json.timestamp))
  }
}
