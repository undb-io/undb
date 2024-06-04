import type { z } from "@undb/zod"
import { abstractDateAggregate } from "./variants/abstractions/abstract-date.aggregate"
import { abstractNumberAggregate } from "./variants/abstractions/abstract-number.aggregate"
import { abstractUserAggregate } from "./variants/abstractions/abstract-user.aggregate"
import { stringFieldAggregate } from "./variants/string-field/string-field.aggregate"

export const fieldAggregate = stringFieldAggregate
  .or(abstractNumberAggregate)
  .or(abstractDateAggregate)
  .or(abstractUserAggregate)

export type IFieldAggregate = z.infer<typeof fieldAggregate>
