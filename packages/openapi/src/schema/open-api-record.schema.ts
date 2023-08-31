import type { Record } from '@undb/core'
import { recordReadableValueMapper, type Table } from '@undb/core'
import type { ZodRawShape } from 'zod'
import { z } from 'zod'
import { COMPONENT_RECORD } from '../constants.js'
import { createOpenAPIRecordValueSchema } from './record-value.schema.js'

export const createOpenAPIRecordSchema = (table: Table, record?: Record) => {
  const fields = table.schema.fields
  const mapper = recordReadableValueMapper(record)

  const shape: ZodRawShape = {}

  for (const field of fields) {
    shape[field.name.value] = createOpenAPIRecordValueSchema()[field.type].openapi({
      example: mapper[field.type](field),
    })
  }

  return z.object(shape).openapi(COMPONENT_RECORD)
}

export type RecordSchema = ReturnType<typeof createOpenAPIRecordSchema>
