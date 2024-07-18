import { WontImplementException } from "@undb/domain"
import type {
  IWebhookSpecVisitor,
  WebhookDo,
  WebhookEventsIn,
  WithWebhookCondition,
  WithWebhookEnabled,
  WithWebhookEvent,
  WithWebhookHeaders,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTableId,
  WithWebhookURL,
} from "@undb/webhook"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database2 } from "../db"

export class WebhookFilterVisitor extends AbstractQBVisitor<WebhookDo> implements IWebhookSpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database2, "undb_webhook">) {
    super(eb)
  }
  nameEqual(s: WithWebhookName): void {
    const cond = this.eb.eb("name", "=", s.name)
    this.addCond(cond)
  }
  urlEqual(s: WithWebhookURL): void {
    const cond = this.eb.eb("url", "=", s.webhookURL.value)
    this.addCond(cond)
  }
  headersEqual(s: WithWebhookHeaders): void {
    throw new Error("Method not implemented.")
  }
  withTableId(s: WithWebhookTableId): void {
    const cond = this.eb.eb("table_id", "=", s.tableId.value)
    this.addCond(cond)
  }
  enabled(s: WithWebhookEnabled): void {
    const cond = this.eb.eb("enabled", "=", s.enabled)
    this.addCond(cond)
  }
  methodEqual(s: WithWebhookMethod): void {
    const cond = this.eb.eb("method", "=", s.webhookMethod.value)
    this.addCond(cond)
  }
  eventEqual(s: WithWebhookEvent): void {
    const cond = this.eb.eb("event", "=", s.event)
    this.addCond(cond)
  }
  eventsIn(s: WebhookEventsIn): void {
    const cond = this.eb.eb("event", "in", s.events)
    this.addCond(cond)
  }
  conditionEqual(s: WithWebhookCondition): void {
    throw new WontImplementException(WebhookFilterVisitor.name + ".conditionEqual")
  }
  idEqual(s: WithWebhookId): void {
    const cond = this.eb.eb("id", "=", s.webhookId.value)
    this.addCond(cond)
  }
}
