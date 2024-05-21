import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { Condition, createConditionGroup, parseValidCondition, type IRootCondition } from "../schema/fields/condition"

export const tableRLSOption = z
  .object({
    // TODO: use real user id schema
    action: z.enum(["list", "single", "write", "delete", "update", "all"]),
    subject: z.string().array().optional().or(z.literal("all")).default("all"),
  })
  .optional()

export type ITableRLSOptionSchema = typeof tableRLSOption

export type ITableRLSOption = z.infer<typeof tableRLSOption>

const singleTableRLS = createConditionGroup(tableRLSOption, tableRLSOption)

class SingleTableRLS extends Condition<ITableRLSOptionSchema> {}

export const tableRLS = singleTableRLS.array()
export type ITableRLS = z.infer<typeof tableRLS>
export type IRootTableRLS = IRootCondition<ITableRLSOptionSchema>[]

export const parseValidTableRLS = parseValidCondition(tableRLSOption)

export class TableRSL extends ValueObject<SingleTableRLS[]> {
  toJSON() {
    return this.value.map((v) => v.toJSON())
  }
}
