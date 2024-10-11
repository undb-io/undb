import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { createConditionGroup } from "../schema/fields/condition/condition.type"
import { parseValidCondition } from "../schema/fields/condition/condition.util"

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

export const sumAggregate = baseAggregate.extend({
  type: z.literal("sum"),
})

export const avgAggregate = baseAggregate.extend({
  type: z.literal("avg"),
})

export const maxAggregate = baseAggregate.extend({
  type: z.literal("max"),
})

export const minAggregate = baseAggregate.extend({
  type: z.literal("min"),
})

export const aggregate = z.discriminatedUnion("type", [
  countAggregate,
  sumAggregate,
  avgAggregate,
  maxAggregate,
  minAggregate,
])

export type IAggregate = z.infer<typeof aggregate>

export class AggregateVO extends ValueObject<IAggregate> {}
