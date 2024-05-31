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
import { AbstractDBMutationVisitor } from "../abstract-db.visitor"
import type { webhook } from "../tables"

export class WebhookMutationVisitor
  extends AbstractDBMutationVisitor<WebhookDo, typeof webhook>
  implements IWebhookSpecVisitor
{
  constructor(public readonly webhook: WebhookDo) {
    super()
  }
  idEqual(s: WithWebhookId): void {
    throw new Error("Method not implemented.")
  }
  nameEqual(s: WithWebhookName): void {
    this.addUpdates({ url: s.name })
  }
  urlEqual(s: WithWebhookURL): void {
    this.addUpdates({ url: s.webhookURL.value })
  }
  headersEqual(s: WithWebhookHeaders): void {
    this.addUpdates({ headers: s.webhookHeaders.toJSON() })
  }
  withTableId(s: WithWebhookTableId): void {
    throw new Error("Method not implemented.")
  }
  enabled(s: WithWebhookEnabled): void {
    this.addUpdates({ enabled: s.enabled })
  }
  methodEqual(s: WithWebhookMethod): void {
    this.addUpdates({ method: s.webhookMethod.value })
  }
  eventEqual(s: WithWebhookEvent): void {
    this.addUpdates({ event: s.event })
  }
  eventsIn(s: WebhookEventsIn): void {
    throw new Error("Method not implemented.")
  }
  conditionEqual(s: WithWebhookCondition): void {
    this.addUpdates({ condition: s.condition })
  }
}
