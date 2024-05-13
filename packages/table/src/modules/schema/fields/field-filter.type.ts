import type { PartialDeep, SetFieldType, SetRequired } from 'type-fest'
import { z } from 'zod'
import {
  numberFieldFilter,
  stringFieldFilter,
  type INumberFieldFilter,
  type INumberFieldFilterSchema,
  type IStringFieldFilter,
  type IStringFieldFilterSchema,
} from './variants'

export const filedFilter = z.union([stringFieldFilter, numberFieldFilter])

export type IFieldFilter = IStringFieldFilter | INumberFieldFilter
export type IFieldFilterSchema = IStringFieldFilterSchema | INumberFieldFilterSchema
export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, 'value', any>
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, 'fieldId'>
