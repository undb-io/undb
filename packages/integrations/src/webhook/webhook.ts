import type { WebhookId } from './webhook-id.vo'
import type { WebhookURL } from './webhook-url.vo'

export class Webhook {
  public id!: WebhookId
  public url!: WebhookURL

  static empty(): Webhook {
    return new Webhook()
  }
}
