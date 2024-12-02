import { z } from "@undb/zod"
import type { PartialDeep, SetFieldType, SetRequired } from "type-fest"
import { createAutoIncrementFieldCondition } from "../variants/autoincrement-field/autoincrement-field.condition"
import { createCheckboxFieldCondition } from "../variants/checkbox-field/checkbox-field.condition"
import { createCreatedAtFieldCondition } from "../variants/created-at-field/created-at-field.condition"
import { createDateFieldCondition } from "../variants/date-field/date-field.condition"
import { createDateRangeFieldCondition } from "../variants/date-range-field/date-range-field.condition"
import { createEmailFieldCondition } from "../variants/email-field/email-field.condition"
import { createIdFieldCondition } from "../variants/id-field/id-field.condition"
import { createJsonFieldCondition } from "../variants/json-field/json-field.condition"
import { createNumberFieldCondition } from "../variants/number-field/number-field.condition"
import { createSelectFieldCondition } from "../variants/select-field/select-field.condition"
import { createStringFieldCondition } from "../variants/string-field/string-field.condition"
import { createUpdatedAtFieldCondition } from "../variants/updated-at-field/updated-at-field.condition"

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
    ...createDateRangeFieldCondition().options,
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
export type MaybeFieldConditionWithFieldId = SetRequired<MaybeFieldCondition, "field">
