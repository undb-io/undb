import type { WebhookId } from './webhook-id.vo.js'
import type { WebhookTarget } from './webhook-target.vo.js'
import type { WebhookURL } from './webhook-url.vo.js'

export class Webhook {
  public id!: WebhookId
  public url!: WebhookURL
  public target!: WebhookTarget | null
  public enabled!: boolean

  static empty(): Webhook {
    return new Webhook()
  }
}
