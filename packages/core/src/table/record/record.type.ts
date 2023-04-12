import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import { createFieldsSchema_internal, fieldQueryValue } from '../field/index.js'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import { TableId, tableIdSchema } from '../value-objects/index.js'
import type { Record } from './record.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export type Records = Record[]

export const createRecordInput_internal = z.object({
  id: recordIdSchema.optional(),
  tableId: z.instanceof(TableId),
  value: createFieldsSchema_internal,
})
export type ICreateRecordInput_internal = z.infer<typeof createRecordInput_internal>

const queryRecordValues = z.record(fieldIdSchema, fieldQueryValue)
export type IQueryRecordValues = z.infer<typeof queryRecordValues>

export const recordDisplayValues = z.record(fieldIdSchema, z.record(z.array(z.string().nullable()).nullable()))
export type IRecordDisplayValues = z.infer<typeof recordDisplayValues>

export const queryRecordSchema = z.object({
  id: recordIdSchema,
  tableId: tableIdSchema,
  createdAt: z.string().datetime(),
  createdBy: userIdSchema,
  updatedAt: z.string().datetime(),
  autoIncrement: z.number().int().positive().optional(),
  values: queryRecordValues,
  displayValues: recordDisplayValues,
})
export type IQueryRecordSchema = z.infer<typeof queryRecordSchema>

export const queryRecords = z.array(queryRecordSchema)
export type IQueryRecords = z.infer<typeof queryRecords>

export type IQueryTreeRecord = IQueryRecordSchema & { children: IQueryTreeRecords }
export type IQueryTreeRecords = Array<IQueryTreeRecord>
export const queryTreeRecords: z.ZodType<IQueryTreeRecords> = z.lazy(() =>
  queryRecordSchema.merge(z.object({ children: queryTreeRecords })).array(),
)
