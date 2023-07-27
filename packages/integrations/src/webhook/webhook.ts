import type { RecordEvents, Table } from '@undb/core'
import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_RESTORED,
  EVT_RECORD_UPDATED,
  RecordFactory,
  convertFilterSpec,
  type RootFilter,
} from '@undb/core'
import type { IEvent } from '@undb/domain'
import { and } from '@undb/domain'
import { isBoolean, isNil, isObject, isString } from 'lodash-es'
import { None, Some, type Option } from 'oxide.ts'
import { match } from 'ts-pattern'
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
  public filter!: Option<RootFilter>

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

  public refineEvent(table: Table, event: RecordEvents): Option<IEvent> {
    if (this.filter.isNone()) return Some(event)
    const filter = this.filter.unwrap().value
    const spec = convertFilterSpec(filter).unwrap()

    return match(event)
      .returnType<Option<typeof event>>()
      .with(
        { name: EVT_RECORD_CREATED },
        { name: EVT_RECORD_DELETED },
        { name: EVT_RECORD_UPDATED },
        { name: EVT_RECORD_RESTORED },
        (event) => {
          const record = RecordFactory.fromQuery(event.meta.record, table.schema.toIdMap()).unwrap()
          return spec.isSatisfiedBy(record) ? Some(event) : None
        },
      )
      .with(
        { name: EVT_RECORD_BULK_CREATED },
        { name: EVT_RECORD_BULK_DELETED },
        { name: EVT_RECORD_BULK_UPDATED },
        (event) => {
          const records = RecordFactory.fromQueryRecords(Object.values(event.meta.records), table.schema.toIdMap())
          const matched = new Set(records.filter((r) => spec.isSatisfiedBy(r)).map((r) => r.id.value))
          if (matched.size === 0) return None

          return match(event)
            .with({ name: EVT_RECORD_BULK_CREATED }, (event) => {
              event.payload.records = event.payload.records.filter((r) => matched.has(r.id))
              return Some(event)
            })
            .with({ name: EVT_RECORD_BULK_UPDATED }, (event) => {
              event.payload.updates = event.payload.updates.filter((u) => matched.has(u.id))
              return Some(event)
            })
            .with({ name: EVT_RECORD_BULK_DELETED }, (event) => {
              event.payload.records = event.payload.records.filter((r) => matched.has(r.id))
              return Some(event)
            })
            .exhaustive()
        },
      )
      .exhaustive()
  }

  public mergedHeaders(sign: string): IWebhookHeaders {
    return {
      'user-agent': 'undb - webhook',
      ...(this.headers.unpack() ?? {}),
      [UNDB_SIGNATURE_HEADER_NAME]: sign,
    }
  }
}
