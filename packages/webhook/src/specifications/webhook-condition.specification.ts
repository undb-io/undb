import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { None, Ok, Some } from "oxide.ts"
import type { WebhookDo } from "../webhook"
import type { IWebhookSpecVisitor } from "./interface"
import { WebhookCondition, type IRootWebhookCondition } from "../webhook.condition"

export class WithWebhookCondition extends CompositeSpecification<WebhookDo, IWebhookSpecVisitor> {
  constructor(public readonly condition?: IRootWebhookCondition) {
    super()
  }

  isSatisfiedBy(t: WebhookDo): boolean {
    throw new Error("Method not implemented.")
  }

  mutate(t: WebhookDo): Result<WebhookDo, string> {
    const condition = this.condition ? Some(new WebhookCondition(this.condition)) : None
    t.condition = condition
    return Ok(t)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.conditionEqual(this)
    return Ok(undefined)
  }
}
