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
import { eq, inArray } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { webhook } from "../tables"

export class WebhookFilterVisitor extends AbstractDBFilterVisitor<WebhookDo> implements IWebhookSpecVisitor {
  nameEqual(s: WithWebhookName): void {
    this.addCond(eq(webhook.name, s.name))
  }
  urlEqual(s: WithWebhookURL): void {
    this.addCond(eq(webhook.url, s.webhookURL.value))
  }
  headersEqual(s: WithWebhookHeaders): void {
    throw new Error("Method not implemented.")
  }
  withTableId(s: WithWebhookTableId): void {
    this.addCond(eq(webhook.tableId, s.tableId.value))
  }
  enabled(s: WithWebhookEnabled): void {
    this.addCond(eq(webhook.enabled, s.enabled))
  }
  methodEqual(s: WithWebhookMethod): void {
    this.addCond(eq(webhook.method, s.webhookMethod.value))
  }
  eventEqual(s: WithWebhookEvent): void {
    this.addCond(eq(webhook.event, s.event))
  }
  eventsIn(s: WebhookEventsIn): void {
    this.addCond(inArray(webhook.event, s.events))
  }
  conditionEqual(s: WithWebhookCondition): void {
    throw new WontImplementException(WebhookFilterVisitor.name + ".conditionEqual")
  }
  idEqual(s: WithWebhookId): void {
    this.addCond(eq(webhook.id, s.webhookId.value))
  }
}
