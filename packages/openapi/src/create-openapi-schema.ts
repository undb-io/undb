import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import type { IQueryRecordSchema } from '@undb/core'
import { RecordId, recordIdSchema, viewIdSchema, type Table } from '@undb/core'
import { logger } from '@undb/logger'
import { format } from 'date-fns'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OpenAPISnippet from 'openapi-snippet'
import type { OpenAPIObject } from 'openapi3-ts/oas31'
import {
  COMPONENT_MUTATE_RECORD_VALUES,
  COMPONENT_OPTION,
  COMPONENT_RECORD,
  COMPONENT_RECORD_ID,
  COMPONENT_USER,
  COMPONENT_VIEW_ID,
} from './constants.js'
import { createRecord } from './routes/create-record.js'
import { createRecords } from './routes/create-records.js'
import { deleteRecordById } from './routes/delete-record-by-id.js'
import { deleteRecordsByIds } from './routes/delete-records-by-ids.js'
import { duplicateRecordById } from './routes/duplicate-record-by-id.js'
import { duplicateRecordsByIds } from './routes/duplicate-records-by-ids.js'
import { getRecordById } from './routes/get-record-by-id.js'
import { getRecords } from './routes/get-records.js'
import { updateRecords } from './routes/udpate-records.js'
import { updateRecord } from './routes/update-record.js'
import { create401ResponseSchema } from './schema/401.respoonse.js'
import { createOpenAPIMutateRecordSchema } from './schema/mutate-record.schema.js'
import { createOpenAPIRecordSchema } from './schema/open-api-record.schema.js'
import { openAPIOptionSchema, openApiUserSchema } from './schema/record-value.schema.js'

export const createTableSchema = (
  table: Table,
  record?: IQueryRecordSchema,
  host = 'http://localhost:4000',
): OpenAPIObject => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createOpenAPIRecordSchema(table, record)
  registry.register(COMPONENT_RECORD, recordSchema)
  registry.register(COMPONENT_RECORD_ID, recordIdSchema.openapi({ example: record?.id ?? RecordId.createId() }))
  registry.register(COMPONENT_VIEW_ID, viewIdSchema.openapi({ example: table.mustGetView().id.value }))
  registry.register(COMPONENT_OPTION, openAPIOptionSchema)
  registry.register(COMPONENT_USER, openApiUserSchema)
  const valuesSchema = createOpenAPIMutateRecordSchema(table, record)
  registry.register(COMPONENT_MUTATE_RECORD_VALUES, valuesSchema)

  const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })

  const routes = [
    getRecords(table, recordSchema),
    getRecordById(table, recordSchema),
    duplicateRecordById(table),
    duplicateRecordsByIds(table),
    deleteRecordById(table),
    deleteRecordsByIds(table),
    createRecord(table, valuesSchema),
    createRecords(table, valuesSchema),
    updateRecord(table, valuesSchema, record),
    updateRecords(table, valuesSchema, record),
  ]

  for (const route of routes) {
    registry.registerPath(route)

    const unauthorized = create401ResponseSchema()
    route.responses[401] = unauthorized

    route.security = [{ [bearerAuth.name]: [] }]
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
