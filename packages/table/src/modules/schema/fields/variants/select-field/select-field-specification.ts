import { Ok, type Result } from "@undb/domain"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import type { IOptionId } from "../../option/option-id.vo"
import { SelectFieldValue } from "./select-field-value.vo"

export class SelectEqual extends RecordComositeSpecification {
  constructor(
    readonly value: IOptionId | IOptionId[] | null,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof SelectFieldValue && v.equals(new SelectFieldValue(this.value)))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new SelectFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}

export class SelectContainsAnyOf extends RecordComositeSpecification {
  constructor(
    readonly value: IOptionId[],
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => {
      if (!(v instanceof SelectFieldValue)) {
        return false
      }

      const values = v.value
      if (Array.isArray(values)) {
        return this.value.some((v) => values.includes(v))
      }

      return this.value.some((v) => v === values)
    })
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.selectContainsAnyOf(this)
    return Ok(undefined)
  }
}

export class SelectEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value == null || v.value === undefined)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new SelectFieldValue(null))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEmpty(this)
    return Ok(undefined)
  }
}
