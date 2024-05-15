import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { z } from "zod"
import {
  autoIncrementFieldFilter,
  createdAtFieldFilter,
  idFieldFilter,
  numberFieldFilter,
  stringFieldFilter,
  updatedAtFieldFilter,
  type IAutoIncrementFieldFilter,
  type IAutoIncrementFieldFilterSchema,
  type INumberFieldFilter,
  type INumberFieldFilterSchema,
  type IStringFieldFilter,
  type IStringFieldFilterSchema,
} from "./variants"
import type { ICreatedAtFieldFilter, ICreatedAtFieldFilterSchema } from "./variants/created-at-field"
import type { IIdFieldFilter, IIdFieldFilterSchema } from "./variants/id-field"
import type { IUpdatedAtFieldFilter, IUpdatedAtFieldFilterSchema } from "./variants/updated-at-field"

export const filedFilter = z.union([
  stringFieldFilter,
  numberFieldFilter,
  idFieldFilter,
  createdAtFieldFilter,
  updatedAtFieldFilter,
  autoIncrementFieldFilter,
])

export type IFieldFilter =
  | IStringFieldFilter
  | INumberFieldFilter
  | IIdFieldFilter
  | ICreatedAtFieldFilter
  | IUpdatedAtFieldFilter
  | IAutoIncrementFieldFilter

export type IFieldFilterSchema =
  | IStringFieldFilterSchema
  | INumberFieldFilterSchema
  | IIdFieldFilterSchema
  | ICreatedAtFieldFilterSchema
  | IUpdatedAtFieldFilterSchema
  | IAutoIncrementFieldFilterSchema

export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, "value", any> & { id: string }
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, "fieldId">
