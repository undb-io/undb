import { Ok, type Result } from "@undb/domain"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { ReferenceFieldValue } from "./reference-field-value.vo"

export class ReferenceEqual extends RecordComositeSpecification {
  constructor(
    readonly values: ReferenceFieldValue,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof ReferenceFieldValue && v.equals(this.values))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, this.values)
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.referenceEqual(this)
    return Ok(undefined)
  }
}
