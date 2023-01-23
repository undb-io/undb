import { z } from 'zod'
import { createFieldsSchema_internal, fieldValue } from '../field'
import { fieldIdSchema } from '../field/value-objects/field-id.schema'
import { TableId, tableIdSchema } from '../value-objects'
import type { Record } from './record'
import { recordIdSchema } from './value-objects/record-id.schema'

export type Records = Record[]

export const createRecordInput_internal = z.object({
  id: recordIdSchema.optional(),
  tableId: z.instanceof(TableId),
  value: createFieldsSchema_internal,
})
export type ICreateRecordInput_internal = z.infer<typeof createRecordInput_internal>

const queryRecordValues = z.record(fieldIdSchema, fieldValue)
export type IQueryRecordValues = z.infer<typeof queryRecordValues>

export const queryRecordSchema = z.object({
  id: recordIdSchema,
  tableId: tableIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  autoIncrement: z.number(),
  values: queryRecordValues,
})
export type IQueryRecordSchema = z.infer<typeof queryRecordSchema>

export const queryRecords = z.array(queryRecordSchema)
export type IQueryRecords = z.infer<typeof queryRecords>
