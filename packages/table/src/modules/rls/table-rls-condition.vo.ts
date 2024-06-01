import { z } from "@undb/zod"
import { Condition, createConditionGroup, parseValidCondition } from "../schema/fields/condition"

export const tableRLSOption = z.undefined()

export type ITableRLSOptionSchema = typeof tableRLSOption

export type ITableRLSOption = z.infer<typeof tableRLSOption>

export const tableRLSCondition = createConditionGroup(tableRLSOption, tableRLSOption)

export class TableRLSCondition extends Condition<ITableRLSOptionSchema> {}

export const parseValidTableRLS = parseValidCondition(tableRLSOption)
