import type { PartialDeep, SetFieldType, SetRequired } from 'type-fest'
import type {
  INumberFieldFilter,
  INumberFieldFilterSchema,
  IStringFieldFilter,
  IStringFieldFilterSchema,
} from './variants'

export type IFieldFilter = IStringFieldFilter | INumberFieldFilter
export type IFieldFilterSchema = IStringFieldFilterSchema | INumberFieldFilterSchema
export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, 'value', any>
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, 'fieldId'>
