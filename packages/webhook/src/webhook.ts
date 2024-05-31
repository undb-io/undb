import { and } from "@undb/domain"
import {
  RecordComositeSpecification,
  refineRecordEvents,
  type IRecordEvent,
  type RECORD_EVENTS,
  type TableDo,
  type TableId,
} from "@undb/table"
import { Some, type Option } from "oxide.ts"
import { isObject, isString } from "radash"
import type { IWebhookDTO } from "./dto"
import type { IUpdateWebhookDTO } from "./dto/update-webhook.dto"
import type { WebhookSpecification } from "./specifications/interface"
import { WithWebhookCondition } from "./specifications/webhook-condition.specification"
import { WithWebhookEnabled } from "./specifications/webhook-enabled.specification"
import { WithWebhookHeaders } from "./specifications/webhook-headers.specification"
import { WithWebhookMethod } from "./specifications/webhook-method.specification"
import { WithWebhookName } from "./specifications/webhook-name.specification"
import { WithWebhookEvent } from "./specifications/webhook-tableId.specification"
import { WithWebhookURL } from "./specifications/webhook-url.specification"
import type { IWebhookHeaders, WebhookHeaders } from "./webhook-headers.vo"
import type { WebhookId } from "./webhook-id.vo"
import type { WebhookMethod } from "./webhook-method.vo"
import type { WebhookURL } from "./webhook-url.vo"
import type { WebhookCondition } from "./webhook.condition"
import { UNDB_SIGNATURE_HEADER_NAME } from "./webhook.constants"
import type { IWebhookMessage, IWebhookMessageBody } from "./webhook.message"

export class WebhookDo {
  public id!: WebhookId
  public name!: string
  public url!: WebhookURL
  public method!: WebhookMethod
  public enabled!: boolean
  public tableId!: TableId
  public event!: RECORD_EVENTS
  public headers!: WebhookHeaders
  public condition!: Option<WebhookCondition>

  static empty(): WebhookDo {
    return new WebhookDo()
  }

  public $updateWebhook(input: IUpdateWebhookDTO): Option<WebhookSpecification> {
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

  public toJSON(): IWebhookDTO {
    return {
      id: this.id.value,
      name: this.name,
      url: this.url.value,
      method: this.method.value,
      enabled: this.enabled,
      event: this.event,
      tableId: this.tableId.value,
      headers: this.headers.toJSON(),
      condition: this.condition.into(undefined)?.toJSON(),
    }
  }

  public refineEvent(table: TableDo, event: IRecordEvent): Option<IRecordEvent> {
    if (this.condition.isNone()) {
      return Some(event)
    }

    const schema = table.schema
    const condition = this.condition.unwrap()
    const spec = condition.getSpec(schema) as Option<RecordComositeSpecification>

    return refineRecordEvents(table, event, spec)
  }

  public constructBody(event: IRecordEvent): IWebhookMessageBody {
    return {
      id: event.id,
      operatorId: event.operatorId!,
      timestamp: event.timestamp,
      event: event,
    }
  }
  public constructMessage(signature: string, body: IWebhookMessageBody): IWebhookMessage {
    return {
      headers: this.mergedHeaders(signature),
      body,
    }
  }

  public mergedHeaders(sign: string): IWebhookHeaders {
    return {
      "user-agent": "undb - webhook",
      ...(this.headers.unpack() ?? {}),
      [UNDB_SIGNATURE_HEADER_NAME]: sign,
    }
  }
}
