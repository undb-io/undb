import { z } from "zod"
import { colors } from "../../../colors"
import {
  Condition,
  createConditionGroup,
  parseValidCondition,
  type IRootCondition,
} from "../../../schema/fields/condition"

export const viewColorOption = z.object({
  color: colors,
})

export type IViewColorOption = z.infer<typeof viewColorOption>

export type IRootViewColor = IRootCondition<IViewColorOption>

export const viewColorGroup = createConditionGroup(viewColorOption)

export class ViewColor extends Condition<IViewColorOption> {}

export const parseValidViewColor = parseValidCondition(viewColorOption)
