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
import type { ICreatedAtFieldFilter, ICreatedAtFieldFilterSchema } from "./variants/created-at-field"
import type { IIdFieldFilter, IIdFieldFilterSchema } from "./variants/id-field"

export const filedFilter = z.union([stringFieldFilter, numberFieldFilter])

export type IFieldFilter = IStringFieldFilter | INumberFieldFilter | IIdFieldFilter | ICreatedAtFieldFilter
export type IFieldFilterSchema =
  | IStringFieldFilterSchema
  | INumberFieldFilterSchema
  | IIdFieldFilterSchema
  | ICreatedAtFieldFilterSchema
export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, "value", any> & { id: string }
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, "fieldId">
