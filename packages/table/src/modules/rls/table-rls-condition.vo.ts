import { z } from "@undb/zod"
import {
  Condition,
  conditionWithoutFields,
  createConditionGroup,
  parseValidCondition,
} from "../schema/fields/condition"
import type { Field } from "../schema/fields/field.type"

export const tableRLSOption = z.undefined()

export type ITableRLSOptionSchema = typeof tableRLSOption

export type ITableRLSOption = z.infer<typeof tableRLSOption>

export const tableRLSCondition = createConditionGroup(tableRLSOption, tableRLSOption)

export class TableRLSCondition extends Condition<ITableRLSOptionSchema> {
  deleteField(field: Field): TableRLSCondition {
    return new TableRLSCondition(conditionWithoutFields(this.value, new Set([field.id.value])))
  }
}

export const parseValidTableRLS = parseValidCondition(tableRLSOption)
