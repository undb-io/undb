import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { recordEvents } from '@undb/core'
import {
  webhookHeadersSchema,
  webhookIdSchema,
  webhookMethodSchema,
  webhookTargetSchema,
  webhookURLSchema,
} from '@undb/integrations'
import type { ZodOptional, ZodString } from 'zod'
import { z } from 'zod'

export const CreateWebhook = extendApi(
  z.object({
    id: webhookIdSchema.optional() as unknown as ZodOptional<ZodString>,
    name: z.string().min(1),
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    target: webhookTargetSchema.unwrap(),
    headers: webhookHeadersSchema,
    // filter: z.any(),
    event: z.enum(recordEvents),
  }),
)

export class CreateWebhookDTO extends createZodDto(CreateWebhook) {}

export const UpdateWebhook = extendApi(
  z
    .object({
      name: z.string().min(1),
      url: webhookURLSchema,
      method: webhookMethodSchema,
      enabled: z.boolean(),
      headers: webhookHeadersSchema,
      // filter: z.any(),
      event: z.enum(recordEvents),
    })
    .partial(),
)

export class UpdateWebhookDTO extends createZodDto(UpdateWebhook) {}
