import { and } from '@undb/domain'
import type { WebhookSpecification } from './specifications/index.js'
import { WithWebhookId, WithWebhookURL } from './specifications/index.js'
import { Webhook } from './webhook'
import type { IUnsafeCreateWebhook } from './webhook.type.js'

export class WebhookFactory {
  static create(...specs: WebhookSpecification[]): Webhook {
    return and(...specs)
      .unwrap()
      .mutate(Webhook.empty())
      .unwrap()
  }

  static unsafeCreate(input: IUnsafeCreateWebhook): Webhook {
    return this.create(WithWebhookId.fromString(input.id), WithWebhookURL.fromString(input.url))
  }
}
