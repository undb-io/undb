import { and } from '@undb/domain'
import type { WebhookSpecification } from './specifications/index.js'
import {
  WithWebhookEnabled,
  WithWebhookFilter,
  WithWebhookHeaders,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTarget,
  WithWebhookURL,
  newWebhookSpec,
} from './specifications/index.js'
import { Webhook } from './webhook.js'
import type { ICreateWebhookSchema } from './webhook.schema.js'
import type { IUnsafeCreateWebhook } from './webhook.type.js'

export class WebhookFactory {
  static create(...specs: WebhookSpecification[]): Webhook {
    return and(...specs)
      .unwrap()
      .mutate(Webhook.empty())
      .unwrap()
  }

  static from(input: ICreateWebhookSchema): Webhook {
    const spec = newWebhookSpec(input)

    return this.create(spec)
  }

  static unsafeCreate(input: IUnsafeCreateWebhook): Webhook {
    return this.create(
      WithWebhookId.fromString(input.id),
      WithWebhookURL.fromString(input.url),
      WithWebhookTarget.from(input.target),
      new WithWebhookEnabled(input.enabled),
      WithWebhookMethod.fromString(input.method),
      new WithWebhookName(input.name),
      WithWebhookHeaders.from(input.headers),
      new WithWebhookFilter(input.filter ?? null),
    )
  }
}
