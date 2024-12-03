import type {
  IWebhookSpecVisitor,
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
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import { json } from "../qb.util"

export class WebhookMutationVisitor extends AbstractQBMutationVisitor implements IWebhookSpecVisitor {
  idEqual(s: WithWebhookId): void {
    throw new Error("Method not implemented.")
  }
  nameEqual(s: WithWebhookName): void {
    this.setData("name", s.name)
  }
  urlEqual(s: WithWebhookURL): void {
    this.setData("url", s.webhookURL.value)
  }
  headersEqual(s: WithWebhookHeaders): void {
    this.setData("headers", json(s.webhookHeaders.toJSON()))
  }
  withTableId(s: WithWebhookTableId): void {
    throw new Error("Method not implemented.")
  }
  enabled(s: WithWebhookEnabled): void {
    this.setData("enabled", s.enabled)
  }
  methodEqual(s: WithWebhookMethod): void {
    this.setData("method", s.webhookMethod.value)
  }
  eventEqual(s: WithWebhookEvent): void {
    this.setData("event", s.event)
  }
  eventsIn(s: WebhookEventsIn): void {
    throw new Error("Method not implemented.")
  }
  conditionEqual(s: WithWebhookCondition): void {
    this.setData("condition", json(s.condition))
  }
}
