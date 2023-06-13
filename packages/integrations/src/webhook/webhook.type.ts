import type { z } from 'zod'
import type { queryWebhook, unsafeCreateWebhookSchema } from './webhook.schema.js'

export type IQueryWebhook = z.infer<typeof queryWebhook>

export type IUnsafeCreateWebhook = z.infer<typeof unsafeCreateWebhookSchema>
