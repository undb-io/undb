import { z } from "@undb/zod"
import { colors } from "../../../colors"
import { Condition } from "../../../schema/fields/condition/abstract-condition.vo"
import { createConditionGroup, type IRootCondition } from "../../../schema/fields/condition/condition.type"
import { conditionWithoutFields, parseValidCondition } from "../../../schema/fields/condition/condition.util"
import type { Field } from "../../../schema/fields/field.type"

export const viewColorOption = z.object({
  color: colors,
})

export type IViewColorOptionSchema = typeof viewColorOption

export type IViewColorOption = z.infer<IViewColorOptionSchema>

export type IRootViewColor = IRootCondition<IViewColorOptionSchema>

export const viewColorGroup = createConditionGroup(viewColorOption.optional(), viewColorOption)

export type IViewColorGroup = z.infer<typeof viewColorGroup>

export class ViewColor extends Condition<IViewColorOptionSchema> {
  deleteField(field: Field): ViewColor {
    return new ViewColor(conditionWithoutFields(this.value, new Set([field.id.value])))
  }
}

export const parseValidViewColor = parseValidCondition(viewColorOption)
