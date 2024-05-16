import { ValueObject } from "@undb/domain"
import { isEqual } from "radash"
import type { z } from "zod"
import type { IFieldCondition, Schema } from "../.."
import type { IRootCondition, MaybeConditionGroup } from "./condition.type"
import {
  getFieldSpec,
  getFlattenFieldConditions,
  getSpec,
  isEmptyConditionGroup,
  toMaybeConditionGroup,
} from "./condition.util"
import type { TableDo } from "../../../../table.do"
import type { RecordDO } from "../../../records/record/record.do"

export abstract class Condition<OptionType extends z.ZodTypeAny> extends ValueObject<IRootCondition<OptionType>> {
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

  getMatchedFieldConditions(table: TableDo, record: RecordDO) {
    const schema = table.schema.fieldMapById
    const conditions = this.flattenFieldConditions

    const returnValue: IFieldCondition<OptionType>[] = []
    for (const condition of conditions) {
      const spec = getFieldSpec(schema, condition)
      if (spec.isNone()) {
        continue
      }
      if (spec.unwrap().isSatisfiedBy(record)) {
        returnValue.push(condition)
      }
    }

    return returnValue
  }

  get flattenFieldConditions(): IFieldCondition<OptionType>[] {
    return getFlattenFieldConditions<OptionType>(this.value)
  }
}
