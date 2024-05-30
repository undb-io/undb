import type { z } from "zod"
import type { unsafeCreateWebhookSchema } from "./webhook.schema.js"

export type IUnsafeCreateWebhook = z.infer<typeof unsafeCreateWebhookSchema>
