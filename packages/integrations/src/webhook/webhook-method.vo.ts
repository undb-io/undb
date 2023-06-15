import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const webhookMethodSchema = z.enum(['POST', 'GET', 'PATCH', 'DELETE'])

export type IWebhookMethod = z.infer<typeof webhookMethodSchema>

export class WebhookMethod extends ValueObject<IWebhookMethod> {}
