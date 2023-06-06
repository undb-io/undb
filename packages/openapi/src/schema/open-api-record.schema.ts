import type { Record, Table } from '@undb/core'
import { COMPONENT_RECORD } from 'src/constants'
import type { ZodRawShape } from 'zod'
import { z } from 'zod'
import { createOpenAPIRecordValueSchema, getOpenAPIExample } from './record-value.schema.js'

export const createOpenAPIRecordSchema = (table: Table, record?: Record) => {
  const openAPIRecordValueSchema = createOpenAPIRecordValueSchema()
  const fields = table.schema.fields

  const shape: ZodRawShape = {}

  for (const field of fields) {
    const example = getOpenAPIExample(field, record)
    shape[field.name.value] = openAPIRecordValueSchema[field.type].openapi({
      example: example[field.type],
    })
  }

  return z.object(shape).openapi(COMPONENT_RECORD)
}

export type RecordSchema = ReturnType<typeof createOpenAPIRecordSchema>
