import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { None, Ok, Some } from "oxide.ts"
import type { Webhook } from "../webhook"
import type { IWebhookSpecVisitor } from "./interface"
import { WebhookCondition, type IRootWebhookCondition } from "../webhook.condition"

export class WithWebhookCondition extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly condition?: IRootWebhookCondition) {
    super()
  }

  isSatisfiedBy(t: Webhook): boolean {
    throw new Error("Method not implemented.")
  }

  mutate(t: Webhook): Result<Webhook, string> {
    const condition = this.condition ? Some(new WebhookCondition(this.condition)) : None
    t.condition = condition
    return Ok(t)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.conditionEqual(this)
    return Ok(undefined)
  }
}
