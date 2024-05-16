import { ZodType, z, type ZodTypeAny } from "zod"
import { fieldCondition, type IFieldCondition, type MaybeFieldCondition } from "./field-condition.type"

type Conjunction = "and" | "or"

export type IConditionGroupChildren<OptionType = undefined> = Array<IFieldCondition | IConditionGroup<OptionType>>

export interface IConditionGroup<OptionType = undefined> {
  conjunction: Conjunction
  children: IConditionGroupChildren<OptionType>
  disabled?: boolean
  option?: OptionType
}

export type IRootCondition<OptionType = undefined> = IConditionGroup<OptionType>

export interface MaybeConditionGroup<OptionType = undefined> {
  id: string
  conjunction: Conjunction
  children: Array<MaybeFieldCondition | MaybeConditionGroup<OptionType>>
  disabled?: boolean
  option?: OptionType
}

export function createConditionGroup<OptionType extends ZodTypeAny>(
  optionType: OptionType,
): ZodType<IConditionGroup<z.infer<OptionType>>> {
  return z.object({
    conjunction: z.enum(["and", "or"]),
    children: z.array(z.union([...fieldCondition.options, z.lazy(() => createConditionGroup(optionType))])),
    disabled: z.boolean().optional(),
    option: optionType,
  })
}
