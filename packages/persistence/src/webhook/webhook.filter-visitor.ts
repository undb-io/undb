import type {
  IWebhookSpecVisitor,
  WebhookDo,
  WebhookEventsIn,
  WebhookSpecification,
  WithWebhookCondition,
  WithWebhookEnabled,
  WithWebhookEvent,
  WithWebhookHeaders,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTable,
  WithWebhookTarget,
  WithWebhookURL,
} from "@undb/webhook"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { webhook } from "../tables"
import { eq } from "drizzle-orm"

export class WebhookFilterVisitor extends AbstractDBFilterVisitor<WebhookDo> implements IWebhookSpecVisitor {
  idEqual(s: WithWebhookId): void {
    this.addCond(eq(webhook.id, s.webhookId.value))
  }
  nameEqual(s: WithWebhookName): void {
    throw new Error("Method not implemented.")
  }
  urlEqual(s: WithWebhookURL): void {
    throw new Error("Method not implemented.")
  }
  headersEqual(s: WithWebhookHeaders): void {
    throw new Error("Method not implemented.")
  }
  targetEqual(s: WithWebhookTarget): void {
    throw new Error("Method not implemented.")
  }
  enabled(s: WithWebhookEnabled): void {
    throw new Error("Method not implemented.")
  }
  methodEqual(s: WithWebhookMethod): void {
    throw new Error("Method not implemented.")
  }
  targetTable(s: WithWebhookTable): void {
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
  and(left: WebhookSpecification, right: WebhookSpecification): IWebhookSpecVisitor {
    throw new Error("Method not implemented.")
  }
  or(left: WebhookSpecification, right: WebhookSpecification): IWebhookSpecVisitor {
    throw new Error("Method not implemented.")
  }
  not(): IWebhookSpecVisitor {
    throw new Error("Method not implemented.")
  }
  clone(): IWebhookSpecVisitor {
    throw new Error("Method not implemented.")
  }
}
