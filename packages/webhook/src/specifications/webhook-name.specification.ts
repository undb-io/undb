import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import type { WebhookDo } from "../webhook.js"
import type { IWebhookSpecVisitor } from "./interface.js"

export class WithWebhookName extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly name: string) {
    super()
  }

  isSatisfiedBy(w: WebhookDo): boolean {
    return this.name === w.name
  }

  mutate(w: WebhookDo): Result<WebhookDo, string> {
    w.name = this.name
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.nameEqual(this)
    return Ok(undefined)
  }
}
