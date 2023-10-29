import type { Record } from '@undb/core'
import { type Table } from '@undb/core'
import type { ZodDefault, ZodRawShape, ZodTypeAny } from 'zod'
import { z } from 'zod'
import { COMPONENT_MUTATE_RECORD_VALUES } from '../constants.js'

export const createOpenAPIMutateRecordSchema = (table: Table, record?: Record) => {
  const fields = table.schema.fields
  const shape: ZodRawShape = {}
  const valueJSON = record?.valuesJSON

  for (const field of fields) {
    if (field.controlled) continue
    const fieldSchema = field.valueSchema as ZodDefault<ZodTypeAny>
    shape[field.name.value] = fieldSchema.optional().openapi({
      description: field.type,
      example: valueJSON?.[field.id.value],
    })
  }

  return z.object(shape).openapi(COMPONENT_MUTATE_RECORD_VALUES)
}

export type ICreateOpenAPIMutateRecordSchema = ReturnType<typeof createOpenAPIMutateRecordSchema>

export type IOpenAPIMutateRecordSchema = z.infer<ICreateOpenAPIMutateRecordSchema>
