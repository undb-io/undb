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
import { eq } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { webhook } from "../tables"

export class WebhookFilterVisitor extends AbstractDBFilterVisitor<WebhookDo> implements IWebhookSpecVisitor {
  nameEqual(s: WithWebhookName): void {
    throw new Error("Method not implemented.")
  }
  urlEqual(s: WithWebhookURL): void {
    throw new Error("Method not implemented.")
  }
  headersEqual(s: WithWebhookHeaders): void {
    throw new Error("Method not implemented.")
  }
  withTableId(s: WithWebhookTableId): void {
    throw new Error("Method not implemented.")
  }
  enabled(s: WithWebhookEnabled): void {
    throw new Error("Method not implemented.")
  }
  methodEqual(s: WithWebhookMethod): void {
    throw new Error("Method not implemented.")
  }
  eventEqual(s: WithWebhookEvent): void {
    throw new Error("Method not implemented.")
  }
  eventsIn(s: WebhookEventsIn): void {
    throw new Error("Method not implemented.")
  }
  conditionEqual(s: WithWebhookCondition): void {
    throw new Error("Method not implemented.")
  }
  idEqual(s: WithWebhookId): void {
    this.addCond(eq(webhook.id, s.webhookId.value))
  }
}
