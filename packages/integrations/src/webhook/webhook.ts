import type { IRootFilter } from '@undb/core'
import type { IEvent } from '@undb/domain'
import { and } from '@undb/domain'
import { isBoolean, isNil, isObject, isString } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { WebhookSpecification } from './specifications/interface.js'
import { WithWebhookEnabled } from './specifications/webhook-enabled.specification.js'
import { WithWebhookFilter } from './specifications/webhook-filter.specification.js'
import { WithWebhookHeaders } from './specifications/webhook-headers.specification.js'
import { WithWebhookMethod } from './specifications/webhook-method.specification.js'
import { WithWebhookName } from './specifications/webhook-name.specification.js'
import { WithWebhookEvent } from './specifications/webhook-target.specification.js'
import { WithWebhookURL } from './specifications/webhook-url.specification.js'
import type { IWebhookHeaders, WebhookHeaders } from './webhook-headers.vo.js'
import type { WebhookId } from './webhook-id.vo.js'
import type { WebhookMethod } from './webhook-method.vo.js'
import type { WebhookTarget } from './webhook-target.vo.js'
import type { WebhookURL } from './webhook-url.vo.js'
import { UNDB_SIGNATURE_HEADER_NAME } from './webhook.constants.js'
import type { IUpdateWebhookSchema } from './webhook.schema.js'

export class Webhook {
  public id!: WebhookId
  public name!: string
  public url!: WebhookURL
  public method!: WebhookMethod
  public enabled!: boolean
  public target!: WebhookTarget | null
  public headers!: WebhookHeaders
  public filter!: Option<IRootFilter>

  static empty(): Webhook {
    return new Webhook()
  }

  public constructEvent(event: IEvent) {
    return {
      id: event.id,
      operatorId: event.operatorId,
      name: event.name,
      timestamp: event.timestamp,
      event: event.payload,
    }
  }

  public updateWebhook(input: IUpdateWebhookSchema): Option<WebhookSpecification> {
    const specs: WebhookSpecification[] = []

    if (isString(input.name)) {
      specs.push(new WithWebhookName(input.name))
    }
    if (isString(input.event)) {
      specs.push(new WithWebhookEvent(input.event))
    }
    if (isString(input.method)) {
      specs.push(WithWebhookMethod.fromString(input.method))
    }
    if (isBoolean(input.enabled)) {
      specs.push(new WithWebhookEnabled(input.enabled))
    }
    if (isString(input.url)) {
      specs.push(WithWebhookURL.fromString(input.url))
    }
    if (isObject(input.headers)) {
      specs.push(WithWebhookHeaders.from(input.headers))
    }
    if (!isNil(input.filter)) {
      specs.push(new WithWebhookFilter(input.filter))
    }

    return and(...specs)
  }

  public mergedHeaders(sign: string): IWebhookHeaders {
    return {
      'user-agent': 'undb - webhook',
      ...(this.headers.unpack() ?? {}),
      [UNDB_SIGNATURE_HEADER_NAME]: sign,
    }
  }
}
