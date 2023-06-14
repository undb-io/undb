import { IEvent } from '@undb/domain'
import type { WebhookId } from './webhook-id.vo.js'
import type { WebhookMethod } from './webhook-method.vo.js'
import type { WebhookTarget } from './webhook-target.vo.js'
import type { WebhookURL } from './webhook-url.vo.js'

export class Webhook {
  public id!: WebhookId
  public url!: WebhookURL
  public method!: WebhookMethod
  public enabled!: boolean
  public target!: WebhookTarget | null

  static empty(): Webhook {
    return new Webhook()
  }

  public getEvent(event: IEvent) {
    return {
      id: event.id,
      operatorId: event.operatorId,
      name: event.name,
      timestamp: event.timestamp,
      event: event.payload,
    }
  }
}
