import type { IEvent } from "@undb/domain"
import { and } from "@undb/domain"
import { Some, type Option } from "oxide.ts"
import type { WebhookSpecification } from "./specifications/interface"
import { WithWebhookEnabled } from "./specifications/webhook-enabled.specification"
import { WithWebhookCondition } from "./specifications/webhook-condition.specification"
import { WithWebhookHeaders } from "./specifications/webhook-headers.specification"
import { WithWebhookMethod } from "./specifications/webhook-method.specification"
import { WithWebhookName } from "./specifications/webhook-name.specification"
import { WithWebhookEvent } from "./specifications/webhook-target.specification"
import { WithWebhookURL } from "./specifications/webhook-url.specification"
import type { IWebhookHeaders, WebhookHeaders } from "./webhook-headers.vo"
import type { WebhookId } from "./webhook-id.vo"
import type { WebhookMethod } from "./webhook-method.vo"
import type { WebhookTarget } from "./webhook-target.vo"
import type { WebhookURL } from "./webhook-url.vo"
import { UNDB_SIGNATURE_HEADER_NAME } from "./webhook.constants"
import type { IUpdateWebhookSchema, IWebhookEventSchema } from "./webhook.schema"
import { RecordComositeSpecification, refineRecordEvents, type IRecordEvent, type TableDo } from "@undb/table"
import { isObject, isString } from "radash"
import type { WebhookCondition } from "./webhook.condition"

export class Webhook {
  public id!: WebhookId
  public name!: string
  public url!: WebhookURL
  public method!: WebhookMethod
  public enabled!: boolean
  public target!: WebhookTarget | null
  public headers!: WebhookHeaders
  public condition!: Option<WebhookCondition>

  static empty(): Webhook {
    return new Webhook()
  }

  public constructEvent(event: IRecordEvent): IWebhookEventSchema {
    return {
      id: event.id,
      operatorId: event.operatorId!,
      timestamp: event.timestamp,
      event: {
        name: event.name,
        payload: event.payload,
        meta: event.meta,
      },
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
    if (typeof input.method === "boolean") {
      specs.push(WithWebhookMethod.fromString(input.method))
    }
    if (typeof input.enabled === "boolean") {
      specs.push(new WithWebhookEnabled(input.enabled))
    }
    if (isString(input.url)) {
      specs.push(WithWebhookURL.fromString(input.url))
    }
    if (isObject(input.headers)) {
      specs.push(WithWebhookHeaders.from(input.headers))
    }
    if (input.condition) {
      specs.push(new WithWebhookCondition(input.condition))
    }

    return and(...specs)
  }

  public refineEvent(table: TableDo, event: IRecordEvent): Option<IEvent> {
    if (this.condition.isNone()) {
      return Some(event)
    }

    const schema = table.schema
    const condition = this.condition.unwrap()
    const spec = condition.getSpec(schema) as Option<RecordComositeSpecification>

    return refineRecordEvents(table, event, spec)
  }

  public mergedHeaders(sign: string): IWebhookHeaders {
    return {
      "user-agent": "undb - webhook",
      ...(this.headers.unpack() ?? {}),
      [UNDB_SIGNATURE_HEADER_NAME]: sign,
    }
  }
}
