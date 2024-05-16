import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { z } from "zod"
import { colors } from "../../../colors"
import {
  createAutoIncrementFieldCondition,
  createCreatedAtFieldCondition,
  createIdFieldCondition,
  createNumberFieldCondition,
  createStringFieldCondition,
  createUpdatedAtFieldCondition,
} from "../variants"

function createConditionSchema<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  return z.union([
    ...createStringFieldCondition(itemType).options,
    ...createNumberFieldCondition(itemType).options,
    ...createIdFieldCondition(itemType).options,
    ...createCreatedAtFieldCondition(itemType).options,
    ...createUpdatedAtFieldCondition(itemType).options,
    ...createAutoIncrementFieldCondition(itemType).options,
  ])
}

export const fieldCondition = createConditionSchema(z.undefined())

export type IFieldConditionSchema = typeof fieldCondition
export type IFieldCondition = z.infer<IFieldConditionSchema>

export type MaybeFieldCondition = SetFieldType<PartialDeep<IFieldCondition>, "value", any> & { id: string }
export type MaybeFieldConditionWithFieldId = SetRequired<MaybeFieldCondition, "fieldId">

export const fieldColorCondition = createConditionSchema(z.object({ color: colors }))

export type IFieldColorConditionSchema = typeof fieldColorCondition
export type IFieldColorCondition = z.infer<IFieldColorConditionSchema>
