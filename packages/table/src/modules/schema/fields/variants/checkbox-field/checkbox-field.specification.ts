import { Ok, type Result } from "@undb/domain"
import { isEqual } from "radash"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { CheckboxFieldValue } from "./checkbox-field-value.vo"

export class CheckboxEqual extends RecordComositeSpecification {
  constructor(
    readonly value: boolean,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isEqual(v.value, this.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new CheckboxFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.checkboxEqual(this)
    return Ok(undefined)
  }
}
