import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import type { Record } from '@undb/core'
import {
  RecordId,
  readableOptionSchema,
  recorEventSchema,
  recordIdSchema,
  recordReadableValueSchemaMap,
  viewIdSchema,
  type Table,
} from '@undb/core'
import { queryWebhook, webhookIdSchema } from '@undb/integrations'
import { logger } from '@undb/logger'
import { format } from 'date-fns'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OpenAPISnippet from 'openapi-snippet'
import type { OpenAPIObject } from 'openapi3-ts/oas31'
import { API_TOKEN_HEADER_NAME } from './api-token/api-token.constants.js'
import {
  COMPONENT_MUTATE_RECORD_VALUES,
  COMPONENT_OPTION,
  COMPONENT_RECORD,
  COMPONENT_RECORD_EVENT,
  COMPONENT_RECORD_ID,
  COMPONENT_USER,
  COMPONENT_VIEW_ID,
  COMPONENT_WEBHOOK,
  COMPONENT_WEBHOOK_ID,
} from './constants.js'
import { createRecord } from './routes/create-record.js'
import { createRecords } from './routes/create-records.js'
import { createWebhook } from './routes/create-webhook.js'
import { deleteRecordById } from './routes/delete-record-by-id.js'
import { deleteRecordsByIds } from './routes/delete-records-by-ids.js'
import { deleteWebhook } from './routes/delete-webhook.js'
import { duplicateRecordById } from './routes/duplicate-record-by-id.js'
import { duplicateRecordsByIds } from './routes/duplicate-records-by-ids.js'
import { getRecordById } from './routes/get-record-by-id.js'
import { getRecords } from './routes/get-records.js'
import { getWebhooks } from './routes/get-webhooks.js'
import { restoreRecordById } from './routes/restore-record-by-id.js'
import { subscription } from './routes/subscription.js'
import { updateRecords } from './routes/udpate-records.js'
import { updateRecord } from './routes/update-record.js'
import { updateWebhook } from './routes/update-webhook.js'
import { create401ResponseSchema } from './schema/401.respoonse.js'
import { createOpenAPIMutateRecordSchema } from './schema/mutate-record.schema.js'
import { createOpenAPIRecordSchema } from './schema/open-api-record.schema.js'
import { createCreateWebhookSchema, createUpdateWebhookSchema } from './schema/webhook.schema.js'
import { recordEventsWebhook } from './webhooks/record-events.webhook.js'

export const createTableSchema = (table: Table, record?: Record, host = 'http://localhost:4000'): OpenAPIObject => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createOpenAPIRecordSchema(table, record)
  registry.register(COMPONENT_RECORD, recordSchema)
  registry.register(COMPONENT_RECORD_ID, recordIdSchema.openapi({ example: record?.id.value ?? RecordId.createId() }))
  registry.register(COMPONENT_VIEW_ID, viewIdSchema.openapi({ example: table.mustGetView().id.value }))
  registry.register(COMPONENT_OPTION, readableOptionSchema)
  registry.register(COMPONENT_USER, recordReadableValueSchemaMap['created-by'])
  registry.register(COMPONENT_USER, recordReadableValueSchemaMap['updated-by'])
  const valuesSchema = createOpenAPIMutateRecordSchema(table, record)
  registry.register(COMPONENT_MUTATE_RECORD_VALUES, valuesSchema)

  registry.register(COMPONENT_WEBHOOK, queryWebhook.omit({ filter: true }))
  registry.register(COMPONENT_WEBHOOK_ID, webhookIdSchema)

  registry.register(COMPONENT_RECORD_EVENT, recorEventSchema)

  const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'https://docs.undb.xyz/openapi/1tokens#auth-token',
  })

  const apiKeyAuth = registry.registerComponent('securitySchemes', 'apiKeyAuth', {
    type: 'apiKey',
    in: 'header',
    name: API_TOKEN_HEADER_NAME,
    description: 'https://docs.undb.xyz/openapi/1tokens#api-token',
  })

  const createWebhookSchema = createCreateWebhookSchema(table)
  const updateWebhookSchema = createUpdateWebhookSchema(table)

  const routes: RouteConfig[] = [
    getRecords(table, recordSchema),
    getRecordById(table, recordSchema),
    duplicateRecordById(table),
    duplicateRecordsByIds(table),
    deleteRecordById(table),
    deleteRecordsByIds(table),
    restoreRecordById(table),
    createRecord(table, valuesSchema),
    createRecords(table, valuesSchema),
    updateRecord(table, valuesSchema, record),
    updateRecords(table, valuesSchema, record),

    createWebhook(table, createWebhookSchema),
    updateWebhook(table, updateWebhookSchema),
    deleteWebhook(table),
    getWebhooks(table),

    subscription(table),
  ]

  for (const route of routes) {
    registry.registerPath(route)

    const unauthorized = create401ResponseSchema()
    route.responses[401] = unauthorized

    route.security = [{ [bearerAuth.name]: [] }, { [apiKeyAuth.name]: [] }]
  }

  const webhooks: RouteConfig[] = [recordEventsWebhook(table)]

  for (const webhook of webhooks) {
    registry.registerWebhook(webhook)
  }

  function getOpenApiDocumentation() {
    const generator = new OpenApiGeneratorV31(registry.definitions)

    const generated = generator.generateDocument({
      openapi: '3.1.0',
      info: {
        version: format(new Date(), 'yyyy-MM-dd'),
        title: `undb ${table.name.value} open api`,
        description: `This is the open API of undb table ${table.name.value}`,
      },
      servers: [{ url: host + '/api/v1/openapi' }],
    })

    return generated
  }

  const docs = getOpenApiDocumentation()

  try {
    for (const route of routes) {
      const generated = OpenAPISnippet.getEndpointSnippets(docs, route.path, route.method, [
        'shell_curl',
        'javascript_fetch',
        'javascript_axios',
        'node',
        'go',
      ])
      const path = docs.paths?.[route.path][route.method]
      if (path) {
        path['x-codeSamples'] = []
        for (const [index, snippet] of generated.snippets.entries()) {
          path['x-codeSamples'][index] = { lang: snippet.title, source: snippet.content }
        }
      }
    }
  } catch (error) {
    logger.error(error, 'generate endpoint snippets error')
  }

  return docs
}
