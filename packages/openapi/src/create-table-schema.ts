import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { Table } from '@undb/core'
import { format } from 'date-fns'
import type { OpenAPIObject } from 'openapi3-ts/oas30'
import { getRecordById } from './routes/get-record-by-id'
import { listRecords } from './routes/list-records'

export const createTableSchema = (table: Table): OpenAPIObject => {
  const registry = new OpenAPIRegistry()

  registry.registerPath(listRecords(table))
  registry.registerPath(getRecordById(table))

  function getOpenApiDocumentation() {
    const generator = new OpenApiGeneratorV3(registry.definitions)

    return generator.generateDocument({
      openapi: '3.0.0',
      info: {
        version: format(new Date(), 'yyyy-MM-dd'),
        title: `undb ${table.name.value} open api`,
        description: `This is the open API of undb table ${table.name.value}`,
      },
      servers: [{ url: '/openapi/v1' }],
    })
  }

  const docs = getOpenApiDocumentation()
  return docs
}
