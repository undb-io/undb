import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { z } from "zod"
import {
  numberFieldFilter,
  stringFieldFilter,
  type INumberFieldFilter,
  type INumberFieldFilterSchema,
  type IStringFieldFilter,
  type IStringFieldFilterSchema,
} from "./variants"
import type { IIdFieldFilter, IIdFieldFilterSchema } from "./variants/id-field"

export const filedFilter = z.union([stringFieldFilter, numberFieldFilter])

export type IFieldFilter = IStringFieldFilter | INumberFieldFilter | IIdFieldFilter
export type IFieldFilterSchema = IStringFieldFilterSchema | INumberFieldFilterSchema | IIdFieldFilterSchema
export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, "value", any> & { id: string }
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, "fieldId">
