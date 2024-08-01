import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "fld"
const size = 6

export const fieldId = z.string()
export type IFieldId = z.infer<typeof fieldId>

export const FieldIdVo = IdFactory(prefix, size, fieldId)

export type FieldId = InstanceType<typeof FieldIdVo>
