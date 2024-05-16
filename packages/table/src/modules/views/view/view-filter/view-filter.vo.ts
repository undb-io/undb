import { z } from "zod"
import {
  Condition,
  createConditionGroup,
  parseValidCondition,
  type IRootCondition,
} from "../../../schema/fields/condition"

export const viewFilterOption = z.undefined()

export type IViewFilterOption = z.infer<typeof viewFilterOption>

export type IRootViewFilter = IRootCondition<IViewFilterOption>

export const viewFilterGroup = createConditionGroup(viewFilterOption, viewFilterOption)

export type IViewFilterGroup = z.infer<typeof viewFilterGroup>

export class ViewFilter extends Condition<IViewFilterOption> {}

export const parseValidViewFilter = parseValidCondition(viewFilterOption)
