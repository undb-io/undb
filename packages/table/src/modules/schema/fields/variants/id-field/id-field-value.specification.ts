import { Ok, type Result } from "@undb/domain"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { IdFieldValue } from "./id-field-value.vo"

export class IdEqual extends RecordComositeSpecification {
  constructor(
    readonly values: IdFieldValue,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof IdFieldValue && v.equals(this.values))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}

export class IdIn extends RecordComositeSpecification {
  constructor(
    readonly values: string[],
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.idIn(this)
    return Ok(undefined)
  }
}
