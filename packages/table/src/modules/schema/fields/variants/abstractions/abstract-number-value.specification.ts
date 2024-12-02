import { Ok, type Result } from "@undb/domain"
import { isNumber } from "radash"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { NumberFieldValue } from "../number-field/number-field-value.vo"

export class NumberEqual extends RecordComositeSpecification {
  constructor(
    readonly value: number | null,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value == this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new NumberFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}

export class NumberGT extends RecordComositeSpecification {
  constructor(
    readonly value: number,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value > this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGT(this)
    return Ok(undefined)
  }
}

export class NumberGTE extends RecordComositeSpecification {
  constructor(
    readonly value: number,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value >= this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGTE(this)
    return Ok(undefined)
  }
}

export class NumberLT extends RecordComositeSpecification {
  constructor(
    readonly value: number,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value < this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLT(this)
    return Ok(undefined)
  }
}

export class NumberLTE extends RecordComositeSpecification {
  constructor(
    readonly value: number,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value <= this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLTE(this)
    return Ok(undefined)
  }
}

export class NumberEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => !isNumber(v.value) || v.value === undefined || v.value === null)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEmpty(this)
    return Ok(undefined)
  }
}
