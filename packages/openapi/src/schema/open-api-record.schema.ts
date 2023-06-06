import type { IQueryRecordSchema, Table } from '@undb/core'
import { COMPONENT_RECORD } from 'src/constants'
import type { ZodRawShape } from 'zod'
import { z } from 'zod'
import { openApiRecordValueMapper } from '../presentation/open-api-record.mapper.js'
import { createOpenAPIRecordValueSchema } from './record-value.schema.js'

export const createOpenAPIRecordSchema = (table: Table, record?: IQueryRecordSchema) => {
  const fields = table.schema.fields

  const shape: ZodRawShape = {}

  for (const field of fields) {
    const mapper = openApiRecordValueMapper(record)

    shape[field.name.value] = createOpenAPIRecordValueSchema()[field.type].openapi({
      example: mapper[field.type](field),
    })
  }

  return z.object(shape).openapi(COMPONENT_RECORD)
}

export type RecordSchema = ReturnType<typeof createOpenAPIRecordSchema>
