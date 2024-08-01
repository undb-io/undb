import { CompositeSpecification } from "@undb/domain"
import { TableIdVo, recordEvents, type RECORD_EVENTS, type TableId } from "@undb/table"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import type { WebhookDo } from "../webhook.js"
import type { IWebhookSpecVisitor } from "./interface.js"
import { WithWebhookEnabled } from "./webhook-enabled.specification.js"

export class WithWebhookTableId extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly tableId: TableId) {
    super()
  }

  isSatisfiedBy(w: WebhookDo): boolean {
    return this.tableId.equals(w.tableId)
  }

  mutate(w: WebhookDo): Result<WebhookDo, string> {
    w.tableId = this.tableId
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.withTableId(this)
    return Ok(undefined)
  }
}

export class WebhookEventsIn extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly events: RECORD_EVENTS[]) {
    super()
  }

  isSatisfiedBy(t: WebhookDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: WebhookDo): Result<WebhookDo, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.eventsIn(this)
    return Ok(undefined)
  }
}

export class WithWebhookEvent extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly event: RECORD_EVENTS) {
    super()
  }

  isSatisfiedBy(t: WebhookDo): boolean {
    return t.event === this.event
  }
  mutate(t: WebhookDo): Result<WebhookDo, string> {
    t.event = this.event
    return Ok(t)
  }
  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.eventEqual(this)
    return Ok(undefined)
  }
}

export const withTableEvents = (tableId: string, events: RECORD_EVENTS[]) => {
  return new WithWebhookTableId(new TableIdVo(tableId))
    .and(new WebhookEventsIn([...recordEvents, ...events]))
    .and(WithWebhookEnabled.enabled())
}
