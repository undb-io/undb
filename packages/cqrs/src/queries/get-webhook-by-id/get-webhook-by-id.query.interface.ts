import type * as z from 'zod'
import type { getWebhookByIdQueryInput } from './get-webhook-by-id.query.input.js'
import type { getWebhookByIdQueryOutput } from './get-webhook-by-id.query.output.js'

export type IGetWebhookByIdQuery = z.infer<typeof getWebhookByIdQueryInput>
export type IGetWebhookByIdOutput = z.infer<typeof getWebhookByIdQueryOutput>
