import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "whk"

const size = 8

export const webhookId = z.string().startsWith(prefix)

export const WebhookIdVO = IdFactory(prefix, size)

export type WebhookId = InstanceType<typeof WebhookIdVO>
