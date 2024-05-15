import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { z } from "zod"
import { colors } from "../../colors"
import {
  createAutoIncrementFieldFilter,
  createCreatedAtFieldFilter,
  createIdFieldFilter,
  createNumberFieldFilter,
  createStringFieldFilter,
  createUpdatedAtFieldFilter,
} from "./variants"

function createFilterSchema<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  return z.union([
    ...createStringFieldFilter(itemType).options,
    ...createNumberFieldFilter(itemType).options,
    ...createIdFieldFilter(itemType).options,
    ...createCreatedAtFieldFilter(itemType).options,
    ...createUpdatedAtFieldFilter(itemType).options,
    ...createAutoIncrementFieldFilter(itemType).options,
  ])
}

export const fieldFilter = createFilterSchema(z.undefined())

export type IFieldFilterSchema = typeof fieldFilter
export type IFieldFilter = z.infer<IFieldFilterSchema>

export type MaybeFieldFilter = SetFieldType<PartialDeep<IFieldFilter>, "value", any> & { id: string }
export type MaybeFieldFilterWithFieldId = SetRequired<MaybeFieldFilter, "fieldId">

export const fieldColorFilter = createFilterSchema(z.object({ color: colors }))

export type IFieldColorFilterSchema = typeof fieldColorFilter
export type IFieldColorFilter = z.infer<IFieldColorFilterSchema>
