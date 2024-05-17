import { z, type ZodTypeAny } from "zod"
import { createConditionSchema, type IFieldCondition, type MaybeFieldCondition } from "./field-condition.type"

export type Conjunction = "and" | "or"

export type IConditionGroupChildren<OptionType extends z.ZodTypeAny> = Array<
  IFieldCondition<OptionType> | IConditionGroup<OptionType>
>

export interface IConditionGroup<OptionType extends z.ZodTypeAny> {
  conjunction: Conjunction
  children: IConditionGroupChildren<OptionType>
  disabled?: boolean
  option?: z.infer<OptionType>
}

export type IRootCondition<OptionType extends z.ZodTypeAny> = IConditionGroup<OptionType>

export interface MaybeConditionGroup<OptionType extends z.ZodTypeAny> {
  id: string
  conjunction: Conjunction
  children: Array<MaybeFieldCondition | MaybeConditionGroup<OptionType>>
  disabled?: boolean
  option?: z.infer<OptionType>
}

export function createConditionGroup<OptionType extends ZodTypeAny, FieldOptionType extends ZodTypeAny = OptionType>(
  optionType: OptionType,
  fieldType: FieldOptionType,
): z.ZodType<IConditionGroup<FieldOptionType>> {
  return z.object({
    conjunction: z.enum(["and", "or"]),
    children: z.array(
      z.union([...createConditionSchema(fieldType).options, z.lazy(() => createConditionGroup(optionType, fieldType))]),
    ),
    disabled: z.boolean().optional(),
    option: optionType,
  }) as z.ZodType<IConditionGroup<FieldOptionType>>
}
