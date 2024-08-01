import { Ok, type Result } from "@undb/domain"
import { isEmpty, isEqual } from "radash"
import type { JsonValue } from "type-fest"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { JsonFieldValue } from "./json-field-value.vo"

export class JsonEqual extends RecordComositeSpecification {
  constructor(
    readonly json: JsonValue,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isEqual(v.value, this.json))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new JsonFieldValue(this.json))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.jsonEqual(this)
    return Ok(undefined)
  }
}

export class JsonContains extends RecordComositeSpecification {
  constructor(
    readonly value: string,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => String(v.value).includes(this.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.jsonContains(this)
    return Ok(undefined)
  }
}

export class JsonEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isEmpty(v.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.jsonEmpty(this)
    return Ok(undefined)
  }
}
