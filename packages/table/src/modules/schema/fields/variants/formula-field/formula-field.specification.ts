import { Ok, type Result } from "@undb/domain"
import { isNumber } from "radash"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { FormulaFieldValue } from "./formula-field-value.vo"

export class FormulaEqual extends RecordComositeSpecification {
  constructor(
    readonly value: number | null | boolean,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value == this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new FormulaFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.formulaEqual(this)
    return Ok(undefined)
  }
}

export class FormulaGT extends RecordComositeSpecification {
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
    v.formulaGT(this)
    return Ok(undefined)
  }
}

export class FormulaGTE extends RecordComositeSpecification {
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
    v.formulaGTE(this)
    return Ok(undefined)
  }
}

export class FormulaLT extends RecordComositeSpecification {
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
    v.formulaLT(this)
    return Ok(undefined)
  }
}

export class FormulaLTE extends RecordComositeSpecification {
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
    v.formulaLTE(this)
    return Ok(undefined)
  }
}
