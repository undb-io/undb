import { z } from "@undb/zod"
import type { Field } from "../../../schema"
import {
  Condition,
  conditionWithoutFields,
  createConditionGroup,
  parseValidCondition,
  type IRootCondition,
} from "../../../schema/fields/condition"

export const viewFilterOption = z.any()

export type IViewFilterOptionSchema = typeof viewFilterOption

export type IViewFilterOption = z.infer<IViewFilterOptionSchema>

export type IRootViewFilter = IRootCondition<IViewFilterOptionSchema>

export const viewFilterGroup = createConditionGroup(viewFilterOption, viewFilterOption)

export type IViewFilterGroup = z.infer<typeof viewFilterGroup>

export class ViewFilter extends Condition<IViewFilterOptionSchema> {
  deleteField(field: Field): ViewFilter {
    return new ViewFilter(conditionWithoutFields(this.value, new Set([field.id.value])))
  }
}

export const parseValidViewFilter = parseValidCondition(viewFilterOption)
