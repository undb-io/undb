import { z, type ZodTypeAny } from "@undb/zod"
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

export type MaybeConditionGroupChildren<OptionType extends z.ZodTypeAny> = MaybeConditionGroup<OptionType>["children"]

export function createConditionGroup<OptionType extends ZodTypeAny, FieldOptionType extends ZodTypeAny = OptionType>(
  optionType: OptionType,
  fieldType: FieldOptionType,
  level = 1,
): z.ZodType<IConditionGroup<FieldOptionType>> {
  const nested = level < 3 ? z.lazy(() => createConditionGroup(optionType, fieldType, level + 1)) : undefined
  const child = nested
    ? z.union([...createConditionSchema(fieldType).options, nested])
    : z.union([...createConditionSchema(fieldType).options])

  return z.object({
    conjunction: z.enum(["and", "or"]),
    children: z.array(child),
    disabled: z.boolean().optional(),
    option: optionType,
  }) as z.ZodType<IConditionGroup<FieldOptionType>>
}
