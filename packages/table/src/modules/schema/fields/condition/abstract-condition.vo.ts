import { ValueObject } from "@undb/domain"
import type { z } from "@undb/zod"
import { isEqual } from "radash"
import type { IFieldCondition, Schema } from "../.."
import type { TableDo } from "../../../../table.do"
import type { RecordDO } from "../../../records/record/record.do"
import type { IRootCondition, MaybeConditionGroup } from "./condition.type"
import {
  getFieldSpec,
  getFlattenFieldConditions,
  getSpec,
  isEmptyConditionGroup,
  toMaybeConditionGroup,
} from "./condition.util"

export abstract class Condition<OptionType extends z.ZodTypeAny> extends ValueObject<IRootCondition<OptionType>> {
  constructor(value: IRootCondition<OptionType>) {
    super(value)
  }

  get isEmpty(): boolean {
    return isEmptyConditionGroup(this.value)
  }

  get count() {
    return this.fieldIds.size
  }

  getSpec(schema: Schema) {
    const fieldMap = schema.fieldMapById

    return getSpec(fieldMap, this.value)
  }

  toJSON(): IRootCondition<OptionType> {
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

  get fieldConditiosIter() {
    const vo = this
    return {
      *[Symbol.iterator]() {
        yield* vo.flattenFieldConditions
      },
    }
  }

  get fieldIds(): Set<string> {
    const result = new Set<string>()
    for (const condition of this.fieldConditiosIter) {
      result.add(condition.fieldId)
    }

    return result
  }
}
