import { abstractDateAggregate } from "./variants/abstractions/abstract-date.aggregate"
import { abstractNumberAggregate } from "./variants/abstractions/abstract-number.aggregate"
import { stringFieldAggregate } from "./variants/string-field/string-field.aggregate"

export const fieldAggregate = stringFieldAggregate.or(abstractNumberAggregate).or(abstractDateAggregate)
