import type { ZodRawShape } from 'zod'
import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import {
  collaboratorProfile,
  createFieldsSchema_internal,
  fieldQueryValue,
  fieldQueryValueMap,
} from '../field/index.js'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import type { Table } from '../table.js'
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

export const queryRecordValues = z.record(fieldIdSchema, fieldQueryValue)
export type IQueryRecordValues = z.infer<typeof queryRecordValues>

export const recordDisplayValues = z.record(fieldIdSchema, z.record(z.array(z.string().nullable()).nullable()))
export type IRecordDisplayValues = z.infer<typeof recordDisplayValues>

export const queryRecordSchema = z.object({
  id: recordIdSchema,
  tableId: tableIdSchema,
  createdAt: z.string(),
  createdBy: userIdSchema,
  createdByProfile: collaboratorProfile.nullable(),
  updatedAt: z.string(),
  updatedBy: userIdSchema,
  updatedByProfile: collaboratorProfile.nullable(),
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

export const trashRecordSchema = z
  .object({
    deletedAt: z.string(),
    deletedBy: userIdSchema,
    deletedByProfile: collaboratorProfile,
  })
  .merge(queryRecordSchema)

export type ITrashRecordSchema = z.infer<typeof trashRecordSchema>

export const createRecordValuesQuerySchema = (table: Table) => {
  const fields = table.schema.fields

  const shape: ZodRawShape = {}

  for (const field of fields) {
    if (field.controlled) continue

    const valueSchema = fieldQueryValueMap[field.type]
    shape[field.id.value] = valueSchema
  }

  return z.object(shape)
}

export const createQueryRecordSchema = (table: Table) => {
  const schema = queryRecordSchema

  const valuesSchema = createRecordValuesQuerySchema(table)
  return schema.merge(z.object({ values: valuesSchema }))
}
