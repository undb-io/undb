import type { Table } from '@undb/core'
import {
  EVT_RECORD_CREATED,
  createQueryRecordSchema,
  createRecordReadableValueSchema,
  recordBulkUpdatedEventMeta,
  recordCreatedEvent,
  recordCreatedEventMeta,
  recordCreatedEventPayload,
  recordDeletedEvent,
  recordDeletedEventMeta,
  recordEvents,
  recordRestoredEvent,
  recordRestoredEventMeta,
  recordUpdatedEvent,
  recordUpdatedEventMeta,
  recordUpdatedEventPayload,
  recordsBulkCreatedEvent,
  recordsBulkCreatedEventMeta,
  recordsBulkCreatedEventPayload,
  recordsBulkDeletedEvent,
  recordsBulkDeletedEventMeta,
  recordsBulkDeletedEventPayload,
  recordsBulkUpdatedEvent,
  recordsBulkUpdatedEventPayload,
} from '@undb/core'
import {
  WebhookId,
  baseWebhookRecordEventSchema,
  webhookHeadersSchema,
  webhookIdSchema,
  webhookMethodSchema,
  webhookURLSchema,
} from '@undb/integrations'
import { z } from 'zod'

export const createCreateWebhookSchema = (table?: Table) => {
  const schema = z.object({
    id: webhookIdSchema.optional().openapi({ example: WebhookId.createId() }),
    enabled: z.boolean().openapi({ example: true }),
    method: webhookMethodSchema.openapi({ example: 'POST' }),
    name: z.string().openapi({ example: 'your awesome webhook' }),
    url: webhookURLSchema.openapi({ example: 'https://yourdomain.com/webhook' }),
    event: z.enum(recordEvents).openapi({ example: EVT_RECORD_CREATED }),
    headers: webhookHeadersSchema.openapi({ example: {} }),
  })

  return schema
}

export type IOpenAPICreateWebhookSchema = ReturnType<typeof createCreateWebhookSchema>

export type IOpenAPICreateWebhook = z.infer<IOpenAPICreateWebhookSchema>

export const createUpdateWebhookSchema = (table?: Table) => {
  const schema = z
    .object({
      enabled: z.boolean().openapi({ example: true }),
      method: webhookMethodSchema.openapi({ example: 'POST' }),
      name: z.string().openapi({ example: 'your awesome webhook' }),
      url: webhookURLSchema.openapi({ example: 'https://yourdomain.com/webhook' }),
      event: z.enum(recordEvents).openapi({ example: EVT_RECORD_CREATED }),
    })
    .partial()

  return schema
}

export type IOpenAPIUpdateWebhookSchema = ReturnType<typeof createUpdateWebhookSchema>

export type IOpenAPIUpdateWebhook = z.infer<IOpenAPIUpdateWebhookSchema>

export const createWebhookRecordEventsSchema = (table: Table) => {
  const record = createRecordReadableValueSchema(table)
  const queryRecord = createQueryRecordSchema(table)

  const event = z.discriminatedUnion('name', [
    recordCreatedEvent.pick({ name: true }).merge(
      z.object({
        payload: recordCreatedEventPayload.merge(z.object({ record: record.partial() })),
        meta: recordCreatedEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordUpdatedEvent.pick({ name: true }).merge(
      z.object({
        payload: recordUpdatedEventPayload.merge(
          z.object({
            previousRecord: record.partial(),
            record: record.partial(),
          }),
        ),
        meta: recordUpdatedEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordDeletedEvent.pick({ name: true, payload: true }).merge(
      z.object({
        meta: recordDeletedEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordRestoredEvent.pick({ name: true, payload: true }).merge(
      z.object({
        meta: recordRestoredEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordsBulkCreatedEvent.pick({ name: true }).merge(
      z.object({
        payload: recordsBulkCreatedEventPayload.merge(z.object({ records: record.partial().array() })),
        meta: recordsBulkCreatedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
    recordsBulkUpdatedEvent.pick({ name: true }).merge(
      z.object({
        payload: recordsBulkUpdatedEventPayload.merge(
          z.object({ updates: z.object({ previousRecord: record.partial(), record: record.partial() }).array() }),
        ),
        meta: recordBulkUpdatedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
    recordsBulkDeletedEvent.pick({ name: true }).merge(
      z.object({
        payload: recordsBulkDeletedEventPayload.merge(z.object({ records: record.partial().array() })),
        meta: recordsBulkDeletedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
  ])

  return baseWebhookRecordEventSchema.merge(z.object({ event }))
}
