import { z } from "@undb/zod"
import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import {
  createAutoIncrementFieldCondition,
  createCheckboxFieldCondition,
  createCreatedAtFieldCondition,
  createDateFieldCondition,
  createEmailFieldCondition,
  createIdFieldCondition,
  createJsonFieldCondition,
  createNumberFieldCondition,
  createSelectFieldCondition,
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
    ...createJsonFieldCondition(optionType).options,
    ...createDateFieldCondition(optionType).options,
    ...createEmailFieldCondition(optionType).options,
    ...createSelectFieldCondition(optionType).options,
    ...createCheckboxFieldCondition(optionType).options,
  ])
}

export type IFieldConditionSchemaType<OptionType extends z.ZodTypeAny = z.ZodUndefined> = ReturnType<
  typeof createConditionSchema<OptionType>
>

export type IFieldCondition<OptionType extends z.ZodTypeAny = z.ZodUndefined> = z.infer<
  IFieldConditionSchemaType<OptionType>
>

export type IOpType = IFieldCondition["op"]

export type MaybeFieldCondition = SetFieldType<PartialDeep<IFieldCondition>, "value", any> & { id: string }
export type MaybeFieldConditionWithFieldId = SetRequired<MaybeFieldCondition, "fieldId">
