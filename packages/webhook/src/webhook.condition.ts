import { Condition,type IRootCondition,createConditionGroup,parseValidCondition } from "@undb/table"
import { z } from "@undb/zod"

export const webhookConditionOption = z.any()

export type IWebhookConditionOptionSchema = typeof webhookConditionOption

export type IWebhookConditionOption = z.infer<IWebhookConditionOptionSchema>

export type IRootWebhookCondition = IRootCondition<IWebhookConditionOptionSchema>

export const webhookConditionGroup = createConditionGroup(webhookConditionOption, webhookConditionOption)

export type IWebhookConditionGroup = z.infer<typeof webhookConditionGroup>

export class WebhookCondition extends Condition<IWebhookConditionOptionSchema> {}

export const parseValidWebhookCondition = parseValidCondition(webhookConditionOption)
