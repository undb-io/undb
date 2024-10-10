import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { createConditionGroup } from "../schema/fields/condition/condition.type"

const aggregateCondition = z.undefined()
const aggregateConditionGroup = createConditionGroup(aggregateCondition, aggregateCondition)

export const countAggregate = z.object({
  type: z.literal("count"),
  config: z.object({
    condition: aggregateConditionGroup.optional(),
  }),
})

export const sumAggregate = z.object({
  type: z.literal("sum"),
})

export const avgAggregate = z.object({
  type: z.literal("avg"),
})

export const maxAggregate = z.object({
  type: z.literal("max"),
})

export const minAggregate = z.object({
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
