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

export type IViewColorOptionSchema = typeof viewColorOption

export type IViewColorOption = z.infer<IViewColorOptionSchema>

export type IRootViewColor = IRootCondition<IViewColorOptionSchema>

export const viewColorGroup = createConditionGroup(viewColorOption.optional(), viewColorOption)

export type IViewColorGroup = z.infer<typeof viewColorGroup>

export class ViewColor extends Condition<IViewColorOptionSchema> {}

export const parseValidViewColor = parseValidCondition(viewColorOption)
