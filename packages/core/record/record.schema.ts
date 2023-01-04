import { z } from 'zod'
import { createFieldValueSchema } from '../field'
import { fieldNameSchema } from '../field/value-objects/field-name.vo'
import { recordIdSchema } from './value-objects'

export const mutateRecordValueSchema = z
  .array(
    z.object({
      name: fieldNameSchema,
      value: createFieldValueSchema,
    }),
  )
  .min(1)
export type IMutateRecordValueSchema = z.infer<typeof mutateRecordValueSchema>

export const updateRecordSchema = z.object({
  id: recordIdSchema,
  value: mutateRecordValueSchema,
})
export type IUpdateRecordValueSchema = z.infer<typeof updateRecordSchema>
