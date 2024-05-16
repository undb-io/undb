import { ValueObject } from "@undb/domain"
import { isEqual } from "radash"
import type { Schema } from "../.."
import type { IRootCondition, MaybeConditionGroup } from "./condition.type"
import { getSpec, isEmptyConditionGroup, toMaybeConditionGroup } from "./condition.util"

export abstract class Condition<OptionType> extends ValueObject<IRootCondition<OptionType>> {
  constructor(value: IRootCondition<OptionType>) {
    super(value)
  }

  get isEmpty(): boolean {
    return isEmptyConditionGroup(this.value)
  }

  get count() {
    return this.value.children.length
  }

  getSpec(schema: Schema) {
    const fieldMap = schema.fieldMapById

    return getSpec(fieldMap, this.value)
  }

  toJSON() {
    return { ...this.value }
  }

  isEqual(condition: IRootCondition<OptionType> | null): boolean {
    return isEqual(this.value, condition)
  }

  toMaybeConditionGroup(): MaybeConditionGroup<OptionType> {
    return toMaybeConditionGroup(this.value)
  }
}
