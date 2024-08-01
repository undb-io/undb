import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import { type WebhookId, WebhookIdVO } from "../webhook-id.vo.js"
import type { WebhookDo } from "../webhook.js"
import type { IWebhookSpecVisitor } from "./interface.js"

export class WithWebhookId extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly webhookId: WebhookId) {
    super()
  }

  static fromString(id: string): WithWebhookId {
    return new WithWebhookId(new WebhookIdVO(id))
  }

  static fromNullableString(id?: string): WithWebhookId {
    return new WithWebhookId(id ? new WebhookIdVO(id) : WebhookIdVO.create())
  }

  static create(): WithWebhookId {
    return new WithWebhookId(WebhookIdVO.create())
  }

  isSatisfiedBy(w: WebhookDo): boolean {
    return this.webhookId.equals(w.id)
  }

  mutate(w: WebhookDo): Result<WebhookDo, string> {
    w.id = this.webhookId
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}
