import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const webhookHeadersSchema = z.record(z.string())

export type IWebhookHeaders = z.infer<typeof webhookHeadersSchema>

export class WebhookHeaders extends ValueObject<IWebhookHeaders> {}
