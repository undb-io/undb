import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { createConditionGroup } from "../schema/fields/condition/condition.type"
import { parseValidCondition } from "../schema/fields/condition/condition.util"
import { fieldId } from "../schema/fields/field-id.vo"
import { fieldName } from "../schema/fields/field-name.vo"
import type { FieldType } from "../schema/fields/field.type"

const aggregateCondition = z.undefined()
export type IAggregateCondition = typeof aggregateCondition
export const aggregateConditionGroup = createConditionGroup(aggregateCondition, aggregateCondition)
export type IAggregateConditionGroup = z.infer<typeof aggregateConditionGroup>
export const parseValidAggregateCondition = parseValidCondition(aggregateCondition)

const baseAggregate = z.object({
  condition: aggregateConditionGroup.optional(),
})

export const countAggregate = baseAggregate.extend({
  type: z.literal("count"),
})

const fieldAggregateConfig = z.object({
  field: fieldId.or(fieldName).optional(),
})

export const sumAggregate = baseAggregate.extend({
  type: z.literal("sum"),
  config: fieldAggregateConfig,
})

export const avgAggregate = baseAggregate.extend({
  type: z.literal("avg"),
  config: fieldAggregateConfig,
})

export const maxAggregate = baseAggregate.extend({
  type: z.literal("max"),
  config: fieldAggregateConfig,
})

export const minAggregate = baseAggregate.extend({
  type: z.literal("min"),
  config: fieldAggregateConfig,
})

export const aggregate = z.discriminatedUnion("type", [
  countAggregate,
  sumAggregate,
  avgAggregate,
  maxAggregate,
  minAggregate,
])

const aggregateTypes = aggregate.options.map((o) => o._def.shape().type.value)
type IAggregateTypes = typeof aggregateTypes
type IAggregateType = IAggregateTypes[number]

export type IAggregate = z.infer<typeof aggregate>

export class AggregateVO extends ValueObject<IAggregate> {}

export const filterAggregateField = (fieldType: FieldType, aggregateType: IAggregateType) => {
  if (aggregateType === "sum" || aggregateType === "avg") {
    return fieldType === "number" || fieldType === "currency" || fieldType === "duration" || fieldType === "rating"
  }

  if (aggregateType === "min" || aggregateType === "max") {
    return (
      fieldType === "date" ||
      fieldType === "number" ||
      fieldType === "currency" ||
      fieldType === "duration" ||
      fieldType === "rating"
    )
  }

  // TODO: add date type fields
  return fieldType === "number" || fieldType === "currency" || fieldType === "duration" || fieldType === "rating"
}
