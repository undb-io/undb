import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { z } from "zod"
import {
  createAutoIncrementFieldCondition,
  createCreatedAtFieldCondition,
  createIdFieldCondition,
  createNumberFieldCondition,
  createStringFieldCondition,
  createUpdatedAtFieldCondition,
} from "../variants"

export function createConditionSchema<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  return z.union([
    ...createStringFieldCondition(optionType).options,
    ...createNumberFieldCondition(optionType).options,
    ...createIdFieldCondition(optionType).options,
    ...createCreatedAtFieldCondition(optionType).options,
    ...createUpdatedAtFieldCondition(optionType).options,
    ...createAutoIncrementFieldCondition(optionType).options,
  ])
}

export type IFieldConditionSchema<OptionType extends z.ZodTypeAny = z.ZodUndefined> = ReturnType<
  typeof createConditionSchema<OptionType>
>

export type IFieldCondition<OptionType extends z.ZodTypeAny = z.ZodUndefined> = z.infer<
  IFieldConditionSchema<OptionType>
>

export type IOpType = IFieldCondition["op"]

export type MaybeFieldCondition = SetFieldType<PartialDeep<IFieldCondition>, "value", any> & { id: string }
export type MaybeFieldConditionWithFieldId = SetRequired<MaybeFieldCondition, "fieldId">
