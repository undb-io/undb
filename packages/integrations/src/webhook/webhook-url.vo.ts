import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const webhookURLSchema = z.string().url()

export type IWebhookURL = z.infer<typeof webhookURLSchema>

export class WebhookURL extends ValueObject<IWebhookURL> {}
