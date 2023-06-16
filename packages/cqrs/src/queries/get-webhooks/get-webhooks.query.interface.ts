import type * as z from 'zod'
import type { getWebhooksQueryInput } from './get-webhooks.query.input.js'
import type { getWebhooksQueryOutput } from './get-webhooks.query.output.js'

export type IGetWebhooksQuery = z.infer<typeof getWebhooksQueryInput>
export type IGetWebhooksOutput = z.infer<typeof getWebhooksQueryOutput>
