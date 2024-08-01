import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import { WebhookHeaders, webhookHeadersSchema } from "../webhook-headers.vo.js"
import type { WebhookDo } from "../webhook.js"
import type { IWebhookSpecVisitor } from "./interface.js"

export class WithWebhookHeaders extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly webhookHeaders: WebhookHeaders) {
    super()
  }

  static from(headers: Record<string, string>): WithWebhookHeaders {
    return new WithWebhookHeaders(new WebhookHeaders(webhookHeadersSchema.parse(headers)))
  }

  isSatisfiedBy(w: WebhookDo): boolean {
    return this.webhookHeaders.equals(w.headers)
  }

  mutate(w: WebhookDo): Result<WebhookDo, string> {
    w.headers = this.webhookHeaders
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.headersEqual(this)
    return Ok(undefined)
  }
}
